
//router
import { Router } from "express";


// Read a single order by ID
import { createOrderCtrl, deleteOrder, getOrder, getAllOrdersCtrl, updateOrder, addItemToOrderCtrl, webhookCtrl, deudaCtrl, payCtrl } from '../controllers/orders';
import { addItemToOrderValidation, createOrderValidation, updateOrderValidation } from '../validators/order';
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post('/', authMiddleware, createOrderCtrl);
router.get('/', authMiddleware, getAllOrdersCtrl);
router.get('/:id', authMiddleware, getOrder);
router.put('/:id', authMiddleware, updateOrderValidation, updateOrder);
router.delete('/:id', authMiddleware, deleteOrder);

//cargar los articulos en una orden
router.post('/:id/items', authMiddleware, addItemToOrderValidation, addItemToOrderCtrl);

router.post('/webhook', webhookCtrl)

router.post('/deuda', authMiddleware, deudaCtrl)

router.post('/pay', authMiddleware, payCtrl)

router.get('/items', authMiddleware, deudaCtrl)


export { router }