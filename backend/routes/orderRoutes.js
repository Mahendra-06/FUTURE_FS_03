import express from 'express';
import {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Supports POST /api/orders and GET /api/orders
router.route('/')
  .post(createOrder)
  .get(getOrders);

// Supports PUT /api/orders/:id and DELETE /api/orders/:id
router.route('/:id')
  .put(updateOrderStatus)
  .delete(deleteOrder);

export default router;
