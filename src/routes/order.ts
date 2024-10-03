
//router
import { NextFunction, Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { RequestExt } from "../interfaces/req-ext";
import { Request, Response } from "express";
import { createOrder, getAllOrders, getOrderById, updateOrderById, deleteOrderById } from "../services/orders";
import { pruebaValidation } from "../validators/order";
import { CustomError } from "../utils/customError";

const router = Router();

router.get("/prueba", authMiddleware);

// Create a new order
router.post("/", async (req: Request, res: Response) => {
    try {
        const newOrder = await createOrder(req.body);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: "Error creating order", error });
    }
});

// Read all orders
router.get("/", async (req: RequestExt, res: Response) => {
    try {
        const userId = req.query.userId as string;
        const orders = await getAllOrders(userId);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
});

// Read a single order by ID
router.get("/prueba/:id", pruebaValidation, async (req: Request, res: Response, next: NextFunction) => {
    try {
        //const orderId = req.params.id;
        //convert orderid to number
        const orderId = parseInt(req.params.id);
        if (isNaN(orderId)) {
            throw new CustomError("Invalid order ID", 400);
        }
        const order = await getOrderById(orderId);
        if (order) {
            res.status(200).json(order);
        } else {
            throw new CustomError(" Order not found", 404);
        }
    } catch (error) {
        next(error);
    }
});

// Update an order by ID
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.id);
        if (isNaN(orderId)) {
            res.status(400).json({ message: "Invalid order ID" });
            return;
        }
        const updatedOrder = await updateOrderById(orderId, req.body);
        if (updatedOrder) {
            res.status(200).json(updatedOrder);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating order", error });
    }
});

// Delete an order by ID
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.id);
        if (isNaN(orderId)) {
            res.status(400).json({ message: "Invalid order ID" });
            return;
        }
        const deleted = await deleteOrderById(orderId);
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting order", error });
    }
});



export { router };