

import pg from "pg";
import config from "../config/pg";

const pool = new pg.Pool(config);

import { Articulo, Deuda, Pedido } from "../interfaces/entities.interface";
import { CustomError } from "../utils/customError";
import axios from "axios";
import { PayOrder } from "../interfaces/itemOrder.interface";

async function createOrder(userId: string): Promise<Pedido> {
    const client = await pool.connect();
    try {

        const result = await client.query(
            "INSERT INTO pedido ( estado, userId ) VALUES ('P',$1 ) RETURNING *",
            [userId]
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
            `UPDATE pedido SET ${fields} WHERE id = $1 RETURNING *`,
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
        deleted = await client.query("DELETE FROM pedido WHERE id = $1", [id]);
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
            const { idarticulo, cantidad, precio } = item;
            const result = await client.query(
                "INSERT INTO detallepedido (idPedido, idArticulo, cantidad, precio) VALUES ($1, $2, $3, $4) RETURNING *",
                [idPedido, idarticulo, cantidad, precio]
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

async function generateDeudaAdams(pedidoId: string, total: number, currency: string, user_name: string): Promise<any> { //todo tipo de retorno
    const client = await pool.connect();
    try {


        const siExiste = 'update';
        const apiUrl = 'https://staging.adamspay.com/api/v1/debts';
        const apiKey = process.env.ADAMS_API_KEY;

        // Fecha en UTC
        const ahora = new Date();
        const expira = new Date(ahora);
        expira.setDate(ahora.getDate() + 2); // Agrega 2 días para la fecha de expiración

        // Crear el modelo de la deuda
        const deuda = {
            docId: `${pedidoId}-${user_name}-onofre`,
            label: `Pedido #${pedidoId} `,
            amount: {
                currency: currency,
                value: total
            },
            validPeriod: {
                start: ahora.toISOString().split('.')[0], // Formato ATOM (ISO 8601)
                end: expira.toISOString().split('.')[0]
            }
        };

        // Crear JSON para el POST
        const post = {
            debt: deuda
        };

        // Hacer el POST
        const Response = await axios.post(apiUrl, post, {
            headers: {
                'apikey': apiKey,
                'Content-Type': 'application/json',
                'x-if-exists': siExiste
            }
        })

        return Response.data;
    } finally {
        client.release();
    }
}
async function addDebtIdToOrder(idpedido: number, deudaId: string, userid: string) {
    const client = await pool.connect();
    try {
        const result = await client.query(
            "UPDATE pedido SET deudaId = $1 WHERE idpedido = $2 and userid = $3 RETURNING *",
            [deudaId, idpedido, userid]
        );
        return result.rows[0];
    } finally {
        client.release();
    }
}

async function getOrderWithDebt(idPedido: string, userId: string) {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM pedido WHERE idpedido = $1 and userid = $2 and deudaid is null", [idPedido, userId]);
        return result.rows[0] || null;
    } finally {
        client.release();
    }

}

async function generateOrderPayUrl(userid: string, { items, total }: PayOrder) {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')
        // Crear el pedido
        const order = await client.query(
            "INSERT INTO pedido ( estado, userId ) VALUES ('P',$1 ) RETURNING *",
            [userid]
        );
        if (!order.rows[0]) {
            throw new CustomError("order not created", 500)
        }

        // Agregar los items al pedido
        let acu = 0;
        const cantArt = items.length

        console.log("cantArt", cantArt)
        for (const item of items) {
            const { idarticulo, cantidad, precio } = item;

            const result = await client.query(
                "INSERT INTO detallepedido (idPedido, idArticulo, cantidad, precio) VALUES ($1, $2, $3, $4) RETURNING *",
                [order.rows[0].idpedido, idarticulo, cantidad, precio]
            );
            console.log("result", result.rowCount)
            acu = (result.rowCount || 0) + acu;
        }
        console.log("acu", acu)
        if (acu !== cantArt)
            throw new CustomError("Error al cargar los articulos", 400);

        // 
        const deuda = await generateDeudaAdams(order.rows[0].idpedido.toString(), total, 'PYG', "onofre")

        const updatePedido = await client.query('UPDATE pedido SET deudaid = $1 WHERE idpedido = $2 RETURNING *', [deuda.debt.docId, order.rows[0].idpedido])
        if (!updatePedido.rows[0]) {
            throw new CustomError("order not updated", 500)
        }

        //todo generar deuda interna
        await client.query('COMMIT')

        const response = {
            orderId: order.rows[0].idpedido,
            payUrl: deuda.debt.payUrl
        }
        return response
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()
    }

}


async function getOrderDetailById(orderId: string) {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM detallepedido WHERE idpedido = $1 ", [orderId]);
        return result.rows;
    } finally {
        client.release();
    }
}
export { createOrder, getAllOrders, getOrderDetailById, generateOrderPayUrl, addDebtIdToOrder, getOrderWithDebt, getOrderById, generateDeudaAdams, updateOrderById, deleteOrderById, addItemToOrder };

