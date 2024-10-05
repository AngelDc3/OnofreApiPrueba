import { NextFunction, Request, Response } from "express";


import { createOrder, getAllOrders, getOrderById, updateOrderById, deleteOrderById, addItemToOrder } from "../services/orders";
import { CustomError } from "../utils/customError";
import { matchedData } from "express-validator";
import { RequestExt } from "../interfaces/req-ext";

// Create a new order
export const createOrderCtrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { body } = matchedData(req);
        console.log("pasa")
        const newOrder = await createOrder(body);
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
