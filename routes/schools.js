const express = require('express');
const router = express.Router();
const pool = require('../db');
const Joi = require('joi');

const addSchoolSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  address: Joi.string().min(1).max(255).required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required()
});

router.post('/addSchool', async (req, res) => {
  try {
    const { error, value } = addSchoolSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, address, latitude, longitude } = value;
    const [result] = await pool.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );

    res.status(201).json({ id: result.insertId, name, address, latitude, longitude });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /listSchools?lat=...&lng=...&limit=...
router.get('/listSchools', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const parsedLimit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
    const limit = Number.isInteger(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 100) : 20;

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ error: 'lat and lng query parameters are required and must be numbers' });
    }

    // Haversine formula in SQL to compute distance in kilometers
    const sql = `SELECT id, name, address, latitude, longitude,
      (6371 * acos(
        cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) +
        sin(radians(?)) * sin(radians(latitude))
      )) AS distance
      FROM schools
      ORDER BY distance ASC
      LIMIT ${limit}`;

    const [rows] = await pool.execute(sql, [lat, lng, lat]);
    res.json({ count: rows.length, schools: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
