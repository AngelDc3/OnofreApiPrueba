import { NextFunction, Request, Response } from "express";


import { createOrder, getAllOrders, getOrderById, updateOrderById, deleteOrderById, addItemToOrder, generateDeudaAdams, addDebtIdToOrder, getOrderWithDebt } from "../services/orders";
import { CustomError } from "../utils/customError";
import { matchedData } from "express-validator";
import { RequestExt } from "../interfaces/req-ext";
import { calcularHmac } from "../utils/handleHmacAdams";

// Create a new order
export const createOrderCtrl = async (req: RequestExt, res: Response, next: NextFunction) => {
    try {
        const body = matchedData(req); // para cuando sea necesario
        const userId = req.user?.id;
        const newOrder = await createOrder(userId);
        res.status(201).json(newOrder);
    } catch (error) {
        next(error);
    }
};

// Read all orders
export const getAllOrdersCtrl = async (req: RequestExt, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;

        const orders = await getAllOrders(userId);
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

// Read a single order by ID
export const getOrder = async (req: RequestExt, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const orderId = parseInt(req.params.id);
        if (isNaN(orderId)) {
            throw new CustomError("Invalid order ID", 400);
        }
        const order = await getOrderById(orderId, userId);
        if (!order) {
            throw new CustomError("Order not found", 404);
        }
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

// Update an order by ID
export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { body } = matchedData(req);
        const orderId = parseInt(req.params.id);
        if (isNaN(orderId)) {
            throw new CustomError("Invalid order ID", 400);
        }
        const updatedOrder = await updateOrderById(orderId, body);
        if (!updatedOrder) {
            throw new CustomError("Order not found", 404);
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        next(error);
    }
};

// Delete an order by ID
export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = parseInt(req.params.id);
        if (isNaN(orderId)) {
            throw new CustomError("Invalid order ID", 400);
        }
        const deletedOrder = await deleteOrderById(orderId);
        if (!deletedOrder) {
            throw new CustomError("Order not found", 404);
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const addItemToOrderCtrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = parseInt(req.params.id);
        if (isNaN(orderId)) {
            throw new CustomError("Invalid order ID", 400);
        }
        const body = matchedData(req);

        const updatedOrder = await addItemToOrder(body.items, orderId);
        if (!updatedOrder) {
            throw new CustomError("order not updated", 500);
        }
    } catch (error) {
        next(error);
    }
}

export const webhookCtrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hmacEsperada = calcularHmac(req.body);
        const hmacRecibida = req.headers["x-adams-notify-hash"];

        if (hmacEsperada !== hmacRecibida) {
            throw new CustomError("Invalid HMAC", 400);
        }

        //todo Do something with the webhook data
        console.log(req.body);

        res.status(200).send(req.body);
    } catch (error) {
        console.log("error", error);
        next(error);
    }
}

export const deudaCtrl = async (req: RequestExt, res: Response, next: NextFunction) => {
    try {
        const { body } = req;
        const userId = req.user?.id;
        const validatePedido = await getOrderWithDebt(body.idpedido, userId);
        if (!validatePedido) {
            throw new CustomError("order with debt already exists or order not found", 400);
        }
        const deuda = await generateDeudaAdams(body.idpedido, body.deuda, body.user_name);

        const deudaId = await addDebtIdToOrder(body.idpedido, deuda.debt.docId, userId);

        res.status(200).send(deudaId);
    } catch (error) {
        next(error);
    }
}
