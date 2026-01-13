require('dotenv').config();
const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const { Pool } = require('pg');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
}

app.use(cors());
app.use(express.json());
app.use(auth(authConfig));

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'escape_rooms',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/datatable', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'datatable.html'));
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'profile.html'));
});

function ok(res, message, data, statusCode = 200, status = "OK") {
  res.setHeader('Content-Type', 'application/json');
  return res.status(statusCode).json({
    status,
    message,
    response: data
  });
}

function error(res, statusCode, message, status = "Internal Server Error") {
  res.setHeader('Content-Type', 'application/json');
  return res.status(statusCode).json({
    status,
    message,
    response: null
  });
}

function buildWhereClause(search, attribute) {
  if (!search) return { clause: '', params: [] };

  const param = `%${search}%`;
  const columns = {
    naziv: 'LOWER(er.naziv)',
    adresa: 'LOWER(er.adresa)',
    tezina: 'CAST(er.tezina AS TEXT)',
    trajanje_minute: 'CAST(er.trajanje_minute AS TEXT)',
    maks_igraca: 'CAST(er.maks_igraca AS TEXT)',
    tvrtka: 'LOWER(t.naziv)',
    tematika: 'LOWER(tem.naziv)',
  };

  const conditions =
    attribute && columns[attribute]
      ? [columns[attribute] + ' LIKE LOWER($1)']
      : Object.values(columns).map(c => c + ' LIKE LOWER($1)');

  return {
    clause: ' WHERE (' + conditions.join(' OR ') + ')',
    params: [param]
  };
}

function buildBaseQuery(jsonFormat = true) {
  if (jsonFormat) {
    return `
      SELECT 
        er.id,
        er.naziv,
        er.adresa,
        er.tezina,
        er.trajanje_minute,
        er.maks_igraca,
        er.web_stranica,
        json_build_object(
          'naziv', t.naziv,
          'web_stranica', t.web_stranica,
          'kontakt', t.kontakt
        ) AS tvrtka,
        json_build_object(
          'naziv', tem.naziv
        ) AS tematika
      FROM escape_room er
      LEFT JOIN tvrtka t ON er.tvrtka_id = t.id
      LEFT JOIN tematika tem ON er.tematika_id = tem.id
    `;
  } else {
    return `
      SELECT 
        er.id,
        er.naziv,
        er.adresa,
        er.tezina,
        er.trajanje_minute,
        er.maks_igraca,
        er.web_stranica,
        t.naziv AS tvrtka_naziv,
        tem.naziv AS tematika_naziv
      FROM escape_room er
      LEFT JOIN tvrtka t ON er.tvrtka_id = t.id
      LEFT JOIN tematika tem ON er.tematika_id = tem.id
    `;
  }
}

async function fetchEscapeRooms(search, attribute, jsonFormat = true) {
  const where = buildWhereClause(search, attribute);
  const query =
    buildBaseQuery(jsonFormat) +
    where.clause +
    ' ORDER BY er.id';

  const { rows } = await pool.query(query, where.params);
  return rows;
}

app.get('/api/v1/escape-rooms', async (req, res) => {
  try {
    const { search, attribute } = req.query;
    const rows = await fetchEscapeRooms(search, attribute, true);
    ok(res, "Escape rooms fetched successfully", rows);
  } catch (err) {
    console.error(err);
    error(res, 500, "Error fetching escape rooms");
  }
});

app.get('/api/v1/escape-rooms/:id', async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return error(res, 400, "Escape room ID must be a number", "Bad Request");
  }

  try {
    const query = `
      SELECT 
        er.id,
        er.naziv,
        er.adresa,
        er.tezina,
        er.trajanje_minute,
        er.maks_igraca,
        er.web_stranica,
        json_build_object(
          'naziv', t.naziv,
          'web_stranica', t.web_stranica,
          'kontakt', t.kontakt
        ) AS tvrtka,
        json_build_object(
          'naziv', tem.naziv
        ) AS tematika
      FROM escape_room er
      LEFT JOIN tvrtka t ON er.tvrtka_id = t.id
      LEFT JOIN tematika tem ON er.tematika_id = tem.id
      WHERE er.id = $1
    `;

    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) {
      return error(res, 404, "Escape room not found", "Not Found");
    }

    ok(res, "Escape room fetched successfully", rows[0]);
  } catch (err) {
    error(res, 500, "Error fetching escape room");
  }
});

app.get('/api/v1/escape-rooms/export/json', requiresAuth(), async (req, res) => {
  try {
    const { search, attribute } = req.query;
    const data = await fetchEscapeRooms(search, attribute, true);

    res.setHeader(
      'Content-Disposition',
      'attachment; filename="escape-rooms.json"'
    );
    res.json(data);
  } catch (err) {
    error(res, 500, "Error exporting JSON");
  }
});

app.get('/api/v1/escape-rooms/export/csv', requiresAuth(), async (req, res) => {
  try {
    const { search, attribute } = req.query;
    const rows = await fetchEscapeRooms(search, attribute, false);

    const headers = [
      'ID',
      'Naziv',
      'Adresa',
      'Težina',
      'Trajanje',
      'Maks igrača',
      'Tvrtka',
      'Tematika',
      'Web'
    ];

    let csv = headers.join(',') + '\n';

    rows.forEach(r => {
      csv += [
        r.id,
        `"${r.naziv || ''}"`,
        `"${r.adresa || ''}"`,
        r.tezina || '',
        r.trajanje_minute || '',
        r.maks_igraca || '',
        `"${r.tvrtka_naziv || ''}"`,
        `"${r.tematika_naziv || ''}"`,
        `"${r.web_stranica || ''}"`
      ].join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="escape-rooms.csv"'
    );
    res.send('\ufeff' + csv);
  } catch (err) {
    error(res, 500, "Error exporting CSV");
  }
});

app.get('/api/v1/openapi.json', (req, res) => {
  try {
    const openApiPath = path.join(__dirname, 'openapi.json');
    const openApi = JSON.parse(fs.readFileSync(openApiPath, 'utf8'));
    res.json(openApi);
  } catch (err) {
    error(res, 500, "Error reading OpenAPI specification");
  }
});

app.get('/api/v1/auth/status', (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();
  ok(res, "Auth status fetched successfully", { authenticated: isAuthenticated }, 200, "OK");
});

app.get('/api/v1/profile', requiresAuth(), (req, res) => {
  ok(res, "Profile fetched successfully", req.oidc.user, 200, "OK");
});

app.all('*', (req, res) => {
  error(res, 501, "Route not implemented", "Not Implemented");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
