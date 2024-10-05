
//router
import { Router } from "express";


// Read a single order by ID
import { createOrderCtrl, deleteOrder, getOrder, getAllOrdersCtrl, updateOrder, addItemToOrderCtrl } from '../controllers/orders';
import { addItemToOrderValidation, createOrderValidation, updateOrderValidation } from '../validators/order';
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post('/', authMiddleware, createOrderValidation, createOrderCtrl);
router.get('/', authMiddleware, getAllOrdersCtrl);
router.get('/:id', authMiddleware, getOrder);
router.put('/:id', authMiddleware, updateOrderValidation, updateOrder);
router.delete('/:id', authMiddleware, deleteOrder);

//cargar los articulos en una orden
router.post('/:id/items', authMiddleware, addItemToOrderValidation, addItemToOrderCtrl);


export { router }