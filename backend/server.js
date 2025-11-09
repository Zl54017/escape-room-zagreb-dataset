require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

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

  return { clause: ' WHERE (' + conditions.join(' OR ') + ')', params: [param] };
}

function buildBaseQuery(jsonFormat = true) {
  if (jsonFormat) {
    return `
      SELECT 
        er.id, er.naziv, er.adresa, er.tezina, er.trajanje_minute,
        er.maks_igraca, er.web_stranica,
        json_build_object('naziv', t.naziv) AS tvrtka,
        json_build_object('naziv', tem.naziv) AS tematika
      FROM escape_room er
      LEFT JOIN tvrtka t ON er.tvrtka_id = t.id
      LEFT JOIN tematika tem ON er.tematika_id = tem.id
    `;
  } else {
    return `
      SELECT 
        er.id, er.naziv, er.adresa, er.tezina, er.trajanje_minute,
        er.maks_igraca, er.web_stranica,
        t.naziv AS tvrtka_naziv, tem.naziv AS tematika_naziv
      FROM escape_room er
      LEFT JOIN tvrtka t ON er.tvrtka_id = t.id
      LEFT JOIN tematika tem ON er.tematika_id = tem.id
    `;
  }
}

async function fetchEscapeRooms(search, attribute, jsonFormat = true) {
  const where = buildWhereClause(search, attribute);
  const query = buildBaseQuery(jsonFormat) + where.clause + ' ORDER BY er.id';
  const { rows } = await pool.query(query, where.params);
  return rows;
}

app.get('/api/escape-rooms', async (req, res) => {
  try {
    const data = await fetchEscapeRooms(req.query.search, req.query.attribute);
    res.json(data);
  } catch (err) {
    console.error('Greška:', err);
    res.status(500).json({ error: 'Greška prilikom dohvaćanja podataka' });
  }
});

app.get('/api/escape-rooms/download/json', async (req, res) => {
  try {
    const data = await fetchEscapeRooms(req.query.search, req.query.attribute);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="escape-rooms.json"');
    res.json(data);
  } catch (err) {
    console.error('Greška:', err);
    res.status(500).json({ error: 'Greška prilikom preuzimanja podataka' });
  }
});

app.get('/api/escape-rooms/download/csv', async (req, res) => {
  try {
    const rows = await fetchEscapeRooms(req.query.search, req.query.attribute, false);
    const headers = ['ID', 'Naziv', 'Adresa', 'Težina', 'Trajanje (min)', 'Maks igrača', 'Tvrtka', 'Tematika', 'Web stranica'];
    
    let csv = headers.join(',') + '\n';
    rows.forEach(r => {
      const vals = [
        r.id,
        `"${(r.naziv || '').replace(/"/g, '""')}"`,
        `"${(r.adresa || '').replace(/"/g, '""')}"`,
        r.tezina || '',
        r.trajanje_minute || '',
        r.maks_igraca || '',
        `"${(r.tvrtka_naziv || '').replace(/"/g, '""')}"`,
        `"${(r.tematika_naziv || '').replace(/"/g, '""')}"`,
        `"${(r.web_stranica || '').replace(/"/g, '""')}"`
      ];
      csv += vals.join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="escape-rooms.csv"');
    res.send('\ufeff' + csv);
  } catch (err) {
    console.error('Greška:', err);
    res.status(500).json({ error: 'Greška prilikom preuzimanja podataka' });
  }
});

app.listen(PORT, () => console.log(`Server radi na http://localhost:${PORT}`));
