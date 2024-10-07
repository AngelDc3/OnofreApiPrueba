

import { Request, Response } from 'express';
import pg from 'pg';

import config from '../config/pg';
const pool = new pg.Pool(config);

export const getItems = async () => {
    const client = await pool.connect();
    try {
        const items = await pool.query('SELECT * FROM articulo');
        return items.rows;
    }
    finally {
        client.release();
    }
}

