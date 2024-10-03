

import pg from "pg";
import config from "../config/pg";

const pool = new pg.Pool(config);
import { Order } from "../interfaces/entities.interface";
import { CustomError } from "../utils/customError";
//genera los servicios necesarios segun estos nombres createOrder, getAllOrders, getOrderById, updateOrderById, deleteOrderById


async function createOrder(order: Order): Promise<Order> {
    const client = await pool.connect();
    try {
        const { userId, estado, deudaId, created, updated } = order;
        const result = await client.query(
            "INSERT INTO orders (userId, estado, deudaId, created, updated) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [userId, estado, deudaId, created, updated]
        );
        return result.rows[0];
    } finally {
        client.release();
    }
}

async function getAllOrders(userId: string): Promise<Order[]> {
    const client = await pool.connect();
    try {

        const result = await client.query("SELECT * FROM orders where userId = $1", [userId]);
        return result.rows;
    } finally {
        client.release();
    }
}

async function getOrderById(id: number): Promise<Order | null> {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM orders WHERE id = $1", [id]);
        return result.rows[0] || null;

    }
    finally {
        client.release();
    }
}

async function updateOrderById(id: number, order: Partial<Order>): Promise<Order | null> {
    const client = await pool.connect();
    try {
        const fields = Object.keys(order).map((key, index) => `${key} = $${index + 2}`).join(", ");
        const values = Object.values(order);
        const result = await client.query(
            `UPDATE orders SET ${fields} WHERE id = $1 RETURNING *`,
            [id, ...values]
        );
        return result.rows[0] || null;
    } finally {
        client.release();
    }
}

async function deleteOrderById(id: number): Promise<number | null> {
    const client = await pool.connect();
    let deleted;
    try {
        deleted = await client.query("DELETE FROM orders WHERE id = $1", [id]);
    } finally {
        client.release();
    }
    return deleted.rowCount || null;
}

export { createOrder, getAllOrders, getOrderById, updateOrderById, deleteOrderById };

