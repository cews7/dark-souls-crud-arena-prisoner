import dotenv from 'dotenv';
dotenv.config();

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
    if (apiPath === '/heroes') {
        handleHeroesRequest(req, res);
    } else if (apiPath === '/equipment') {
        // Handle equipment endpoint
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'API endpoint not found' }));
    }
}

const serveFile = async (req, res) => {
    // Map URL path to file system path
    let filePath = path.join(webDirectory, req.url === '/' ? 'index.html' : req.url);
    
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

const handleHeroesRequest = async (req, res) => {
    if (req.method === 'GET') {
        try {
            getHeroes(req, res);
        } catch (err) {
            console.error('Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Error getting heroes' }));
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
            'UPDATE heroes SET name = $1, level = $2, class = $3 WHERE name = $4 RETURNING *',
            [body.name, body.level, body.class, body.name]
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

const validateHeroBody = (body) => {
    const allowedFields = ['name', 'level', 'class'];
    for (const [key, value] of Object.entries(body)) {
        if (!allowedFields.includes(key)) {
            return false;
        }
    }
    return true;
}

const parseJsonBody = async (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const parsedBody = body ? JSON.parse(body) : {};
        resolve(parsedBody);
      } catch (error) {
        reject(error);
      }
    });
    
    req.on('error', (error) => {
      reject(error);
    });
  });
}