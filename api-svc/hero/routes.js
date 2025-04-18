import pool from '../database.js';
import { validateHeroBody, parseJsonBody } from '../utils.js';

export const handleHeroesRequest = async (req, res) => {
    if (req.method === 'GET') {
        if (req.url.match(/api\/heroes\/\d+$/)) {
            getHero(req, res);
        } else if (req.url.match(/api\/heroes\/\d+\/equipment$/)) {
            getEquipmentForHero(req, res);
        } else {
            getHeroes(req, res);
        }
    } else if (req.method === 'POST') {
        try {
            const body = await parseJsonBody(req);
            if (req.url.match(/api\/heroes$/)) {
                await createHero(body, res);
            } else if (req.url.match(/api\/heroes\/(\d+)\/equipment$/)) {
                await addEquipmentToHero(body, res);
            }
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
    } else if (req.method === 'DELETE') {
        try {
            const body = await parseJsonBody(req);
            if (req.url.match(/api\/heroes\/(\d+)$/)) {
                await deleteHero(body, res);
            } else if (req.url.match(/api\/heroes\/(\d+)\/equipment$/)) {
                await deleteEquipmentFromHero(body, res);
            }
        } catch (err) {
            console.error('Error deleting hero:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Error deleting hero' }));
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

const deleteHero = async (body, res) => {
    if (!body.id) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Missing required fields' }));
        return;
    }

    const id = body.id;
    await pool.query('DELETE FROM heroes WHERE id = $1', [id]);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Hero deleted' }));
}

const addEquipmentToHero = async (body, res) => {
    if (body.heroId === null || body.equipmentIds === null) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Missing required fields' }));
        return;
    }

    try {
        const heroId = body.heroId;
        const equipmentIds = body.equipmentIds;
        
        equipmentIds.forEach(async (equipmentId) => {
            await pool.query('UPDATE equipment SET hero_id = $1 WHERE id = $2', [heroId, equipmentId]);
        });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Equipment added to hero' }));
    } catch (err) {
        console.error('Database error:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Error adding equipment to hero' }));
    }
}

const deleteEquipmentFromHero = async (body, res) => {
    if (body.heroId === null || body.equipmentIds === null) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Missing required fields' }));
        return;
    }

    const heroId = body.heroId;
    const equipmentIds = body.equipmentIds;

    equipmentIds.forEach(async (equipmentId) => {
        await pool.query('UPDATE equipment SET hero_id = NULL WHERE id = $1 AND hero_id = $2', [equipmentId, heroId]);
    });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Equipment removed from hero' }));
}

const getEquipmentForHero = async (req, res) => {
    const heroId = req.url.match(/api\/heroes\/(\d+)\/equipment$/)[1];
    
    try {
        const result = await pool.query('SELECT * FROM equipment WHERE hero_id = $1', [heroId]);
        res.end(JSON.stringify(result.rows));
    } catch (err) {
        console.error('Database error:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Error getting equipment for hero' }));
    }
}