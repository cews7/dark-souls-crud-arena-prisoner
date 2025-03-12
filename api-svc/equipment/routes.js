import pool from '../database.js';
import { validateEquipmentBody, parseJsonBody } from '../utils.js';

export const handleEquipmentRequest = async (req, res) => {
    if (req.method === 'GET') {
        getAllEquipment(req, res);
    } else if (req.method === 'POST') {
        const body = await parseJsonBody(req);
        createEquipment(body, res);
    }
}

const getAllEquipment = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM equipment');
        res.end(JSON.stringify(result.rows));
    } catch (err) {
        console.error('Database error:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Error getting equipment' }));
    }
}

const createEquipment = async (body, res) => {
    if (body.name === '' || body.type === '' || body.minLevel === '') {
        console.log('Missing required fields');
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Missing required fields' }));
        return;
    }

    if (!validateEquipmentBody(body)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid equipment data' }));
        return;
    }

    try {
        const result = await pool.query(
            'INSERT INTO equipment (name, type, "minLevel") VALUES ($1, $2, $3) RETURNING *', 
            [body.name, body.type, body.minLevel]
        );
        
        if (result.rowCount === 1) {
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result.rows[0]));
        } else {
            throw new Error('Failed to create equipment');
        }
    } catch (err) {
        console.error('Database error:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Error creating equipment' }));
    }
}