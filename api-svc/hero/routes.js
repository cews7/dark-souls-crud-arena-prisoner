import pool from '../database.js';
import { validateHeroBody, parseJsonBody } from '../utils.js';

export const handleHeroesRequest = async (req, res) => {
    if (req.method === 'GET') {
        if (req.url.match(/api\/heroes\/\d+$/)) {
            getHero(req, res);
        } else {
            getHeroes(req, res);
        }
    } else if (req.method === 'POST') {
        try {
            const body = await parseJsonBody(req);
            await createHero(body, res);
        } catch (err) {
            console.error('Error parsing JSON body:', err);
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid JSON body' }));
        }
    } else if (req.method === 'PUT') {
        try {
            const body = await parseJsonBody(req);
            await updateHero(body, res);
        } catch (err) {
            console.error('Error parsing JSON body:', err);
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid JSON body' }));
        }
    }
}

const getHeroes = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM heroes ORDER BY id ASC');
        res.end(JSON.stringify(result.rows));
    } catch (err) {
        console.error('Database error:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Error getting heroes' }));
    }
}

const getHero = async (req, res) => {
    const id = req.url.split('/').pop();
    try {
        const result = await pool.query('SELECT * FROM heroes WHERE id = $1', [id]);
        res.end(JSON.stringify(result.rows[0]));
    } catch (err) {
        console.error('Database error:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Error getting hero' }));
    }
}

const createHero = async (body, res) => {
    if (body.name === '' || body.level === '' || body.class === '') {
        console.log('Missing required fields');
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Missing required fields' }));
        return;
    }

    if (!validateHeroBody(body)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid hero data' }));
        return;
    }

    try {
        const result = await pool.query(
            'INSERT INTO heroes (name, level, class) VALUES ($1, $2, $3) RETURNING *', 
            [body.name, body.level, body.class]
        );
        
        if (result.rowCount === 1) {
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result.rows[0]));
        } else {
            throw new Error('Failed to create hero');
        }
    } catch (err) {
        console.error('Database error:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Error creating hero' }));
    }
}

const updateHero = async (body, res) => {
    if (body.name === '' || body.level === '' || body.class === '') {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Missing required fields' }));
        return;
    }

    if (!validateHeroBody(body)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid hero data' }));
        return;
    }

    try {
        const result = await pool.query(
            'UPDATE heroes SET name = $1, level = $2, class = $3 WHERE id = $4 RETURNING *',
            [body.name, body.level, body.class, body.id]
        );
        if (result.rowCount) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result.rows[0]));
        } else {
            throw new Error('Failed to update hero');
        }
    } catch (err) {
        console.error('Database error:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Error updating hero' }));
    }
}