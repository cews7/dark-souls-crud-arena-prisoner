import { config } from './config.js';

import { createServer } from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleHeroesRequest } from './hero/routes.js';
import { handleEquipmentRequest } from './equipment/routes.js';

const hostname = config.database.host;
const port = config.server.port;

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
    } else if (apiPath.startsWith('/equipment')) {
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
