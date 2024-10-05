

import pg from "pg";
import config from "../config/pg";

const pool = new pg.Pool(config);
import { Articulo, Pedido } from "../interfaces/entities.interface";
import { CustomError } from "../utils/customError";
//genera los servicios necesarios segun estos nombres createOrder, getAllOrders, getOrderById, updateOrderById, deleteOrderById


async function createOrder(order: Pedido): Promise<Pedido> {
    const client = await pool.connect();
    try {
        const { estado, deudaId } = order
        const result = await client.query(
            "INSERT INTO pedido ( estado, deudaId, ) VALUES ($1, $2 ) RETURNING *",
            [estado, deudaId,]
        );
        return result.rows[0];
    } finally {
        client.release();
    }
}

async function getAllOrders(userId: string): Promise<Pedido[]> {
    const client = await pool.connect();
    try {

        const result = await client.query("SELECT * FROM pedido where userId = $1", [userId]);
        return result.rows;
    } finally {
        client.release();
    }
}

async function getOrderById(idpedido: number, userid: string): Promise<Pedido | null> {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM pedido WHERE idpedido = $1 and userid = $2 ", [idpedido, userid]);
        return result.rows[0] || null;

    }
    finally {
        client.release();
    }
}

async function updateOrderById(id: number, order: Partial<Pedido>): Promise<Pedido | null> {
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

async function addItemToOrder(items: Articulo[], idPedido: number) {
    const client = await pool.connect();
    const cantArt = items.length;
    let acu = 0;
    try {
        for (const item of items) {
            const { idArticulo, cantidad, precio } = item;
            const result = await client.query(
                "INSERT INTO detallepedido (idPedido, idArticulo, cantidad, precio) VALUES ($1, $2, $3, $4) RETURNING *",
                [idPedido, idArticulo, cantidad, precio]
            );
            acu = result.rowCount || 0 + acu;
        }
        if (acu !== cantArt)
            throw new CustomError("Error al cargar los articulos", 400);

        return acu;
    } finally {
        client.release();
    }

}

export { createOrder, getAllOrders, getOrderById, updateOrderById, deleteOrderById, addItemToOrder };

