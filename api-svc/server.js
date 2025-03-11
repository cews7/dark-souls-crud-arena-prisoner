import dotenv from 'dotenv';
dotenv.config();

import { validateHeroBody, validateEquipmentBody, parseJsonBody } from './utils.js';

import { createServer } from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pool from './database.js';

const hostname = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webDirectory = path.join(__dirname, '..', 'web-svc');

const server = createServer(async (req, res) => {
    if (req.url.startsWith('/api')) {
        handleApiRequest(req, res);
    } else {
        serveFile(req, res);
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
})

// Then define these functions
const handleApiRequest = (req, res) => {
    // Parse the API path (remove the /api prefix)
    const apiPath = req.url.substring(4); // Remove '/api'
    // Handle different API endpoints
    if (apiPath.startsWith('/heroes')) {
        handleHeroesRequest(req, res);
    } else if (apiPath === '/equipment') {
        handleEquipmentRequest(req, res);
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'API endpoint not found' }));
    }
}

const serveFile = async (req, res) => {
    // Map URL path to file system path
    let filePath;
    if (req.url.match(/^\/heroes\/\d+$/)) {
        filePath = path.join(webDirectory, 'hero/views/show.html');
    } else if (req.url === '/') {
        filePath = path.join(webDirectory, 'index.html');
    } else {
        filePath = path.join(webDirectory, req.url);
    }
    
    try {
        const data = await fs.readFile(filePath);
        // Determine content type based on file extension
        const ext = path.extname(filePath).toLowerCase();
        const contentType = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif'
        }[ext] || 'application/octet-stream';
        
        // Send the file
        res.statusCode = 200;
        res.setHeader('Content-Type', contentType);
        res.end(data);
    } catch (err) {
        // Handle file not found or other errors
        if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('File not found');
        } else {
            res.statusCode = 500;
            res.end('Server error');
        }
    }
}

const handleEquipmentRequest = async (req, res) => {
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
            'INSERT INTO equipment (name, type, minLevel) VALUES ($1, $2, $3) RETURNING *', 
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

const handleHeroesRequest = async (req, res) => {
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
        const result = await pool.query('SELECT * FROM heroes');
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

