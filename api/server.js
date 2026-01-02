require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'escape_rooms',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
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

app.get('/api/v1/escape-rooms', async (req, res) => {
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
      ORDER BY er.id
    `;
    const { rows } = await pool.query(query);

    ok(res, "Escape rooms fetched successfully", rows, 200, "OK");
  } catch (err) {
    error(res, 500, "Error fetching escape rooms", "Internal Server Error");
  }
});

app.get('/api/v1/escape-rooms/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return error(res, 400, "Escape room ID is a required number", "Bad Request");
    }

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
      return error(res, 404, "Escape room with this ID does not exist", "Not Found");
    }

    ok(res, "Escape room fetched successfully", rows[0], 200, "OK");
  } catch (err) {
    error(res, 500, "Error fetching escape room", "Internal Server Error");
  }
});

app.get('/api/v1/companies', async (req, res) => {
  try {
    const query = `
      SELECT * FROM tvrtka
    `;
    const { rows } = await pool.query(query);
    ok(res, "Companies fetched successfully", rows, 200, "OK");
  } catch (err) {
    error(res, 500, "Error fetching companies", "Internal Server Error");
  }
});

app.get('/api/v1/escape-rooms/company/:companyId', async (req, res) => {
  const companyId = req.params.companyId;
  if (isNaN(companyId)) {
    return error(res, 400, "Company ID is a required number", "Bad Request");
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
      WHERE er.tvrtka_id = $1
    `;
    const { rows } = await pool.query(query, [companyId]);
    if (rows.length === 0) {
      return error(res, 404, "Company with this ID does not exist", "Not Found");
    }
    ok(res, "Escape rooms by company fetched successfully", rows, 200, "OK");
  } catch (err) {
    error(res, 500, "Error fetching escape rooms by company", "Internal Server Error");
  }
});

app.get('/api/v1/escape-rooms/theme/:themeId', async (req, res) => {
  const themeId = req.params.themeId;
  if (isNaN(themeId)) {
    return error(res, 400, "Theme ID is a required number", "Bad Request");
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
      WHERE er.tematika_id = $1
    `;
    const { rows } = await pool.query(query, [themeId]);
    if (rows.length === 0) {
      return error(res, 404, "Theme with this ID does not exist", "Not Found");
    }
    ok(res, "Escape rooms by theme fetched successfully", rows, 200, "OK");
  } catch (err) {
    error(res, 500, "Error fetching escape rooms by theme", "Internal Server Error");
  }
});

app.post('/api/v1/escape-rooms', async (req, res) => {
  const { naziv, adresa, tezina, trajanje_minute, maks_igraca, web_stranica, tvrtka_id, tematika_id } = req.body;
  if (!naziv || !adresa || !tezina || !trajanje_minute || !maks_igraca || !web_stranica || !tvrtka_id || !tematika_id) {
    return error(res, 400, "All fields are required", "Bad Request");
  }
  try {
    const query = `
      INSERT INTO escape_room (naziv, adresa, tezina, trajanje_minute, maks_igraca, web_stranica, tvrtka_id, tematika_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [naziv, adresa, tezina, trajanje_minute, maks_igraca, web_stranica, tvrtka_id, tematika_id]);
    ok(res, "Escape room created successfully", rows[0], 201, "Created");
  } catch (err) {
    error(res, 500, "Error creating escape room", "Internal Server Error");
  }
});

app.put('/api/v1/escape-rooms/:id', async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return error(res, 400, "Escape room ID is a required number", "Bad Request");
  }
  const { naziv, adresa, tezina, trajanje_minute, maks_igraca, web_stranica, tvrtka_id, tematika_id } = req.body;
  if (!naziv || !adresa || !tezina || !trajanje_minute || !maks_igraca || !web_stranica || !tvrtka_id || !tematika_id) {
    return error(res, 400, "All fields are required", "Bad Request");
  }
  try {
    const query = `
      UPDATE escape_room SET naziv = $1, adresa = $2, tezina = $3, trajanje_minute = $4, maks_igraca = $5, web_stranica = $6, tvrtka_id = $7, tematika_id = $8 WHERE id = $9
      RETURNING *
    `;
    const { rows } = await pool.query(query, [naziv, adresa, tezina, trajanje_minute, maks_igraca, web_stranica, tvrtka_id, tematika_id, id]);
    
    if (rows.length === 0) {
      return error(res, 404, "Escape room with this ID does not exist", "Not Found");
    }
    ok(res, "Escape room updated successfully", rows[0], 200, "OK");
  } catch (err) {
    error(res, 500, "Error updating escape room", "Internal Server Error");
  }
});

app.delete('/api/v1/escape-rooms/:id', async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return error(res, 400, "Escape room ID is a required number", "Bad Request");
  }
  try {
    const query = `
      DELETE FROM escape_room WHERE id = $1
      RETURNING id
    `;
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) {
      return error(res, 404, "Escape room with this ID does not exist", "Not Found");
    }
    ok(res, "Escape room deleted successfully", rows[0].id, 200, "OK");
  } catch (err) {
    error(res, 500, "Error deleting escape room", "Internal Server Error");
  }
});

app.get('/api/v1/openapi.json', (req, res) => {
  try {
    const openApiPath = path.join(__dirname, 'openapi.json');
    const openApi = JSON.parse(fs.readFileSync(openApiPath, 'utf8'));
    res.setHeader('Content-Type', 'application/json');
    res.json(openApi);
  } catch (err) {
    error(res, 500, "Error reading OpenAPI specification", "Internal Server Error");
  }
});

app.all('*', async (req, res) => {
  return error(res, 501	, "Route not implemented", "Not Implemented");
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));