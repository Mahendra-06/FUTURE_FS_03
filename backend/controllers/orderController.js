import fs from 'fs';
import path from 'path';
import Order from '../models/Order.js';

const DATA_DIR = path.resolve('data');
const DATA_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data folder and file exists
const initFallbackStorage = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
};

const getFallbackOrders = () => {
  initFallbackStorage();
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    return [];
  }
};

const saveFallbackOrder = (newOrder) => {
  const current = getFallbackOrders();
  current.unshift(newOrder); // Newest first
  fs.writeFileSync(DATA_FILE, JSON.stringify(current, null, 2), 'utf-8');
  return newOrder;
};

// @desc    Create a new artisan order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res, next) => {
  try {
    const { items, totalCost, customerName, customerPhone, tableNumber, paymentMethod } = req.body;

    if (!items || items.length === 0 || !totalCost) {
      res.status(400);
      throw new Error('Order items and total cost are required');
    }

    if (!customerName || !customerPhone || !tableNumber) {
      res.status(400);
      throw new Error('Customer name, phone, and table/seat number are required to complete this order');
    }

    let order;

    if (global.isDbConnected) {
      order = await Order.create({
        items,
        totalCost: Number(totalCost),
        customerName,
        customerPhone,
        tableNumber,
        paymentMethod: paymentMethod || 'Bill to Table',
        status: 'Pending',
      });
    } else {
      order = {
        _id: `ord-${Math.random().toString(36).substr(2, 9)}`,
        items,
        totalCost: Number(totalCost),
        customerName,
        customerPhone,
        tableNumber,
        paymentMethod: paymentMethod || 'Bill to Table',
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveFallbackOrder(order);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public (Admin)
export const getOrders = async (req, res, next) => {
  try {
    let orders;

    if (global.isDbConnected) {
      orders = await Order.find({}).sort({ createdAt: -1 });
    } else {
      orders = getFallbackOrders();
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Public (Admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400);
      throw new Error('Order status is required');
    }

    let order;

    if (global.isDbConnected) {
      order = await Order.findById(id);
      if (!order) {
        res.status(404);
        throw new Error('Order not found');
      }
      order.status = status;
      await order.save();
    } else {
      initFallbackStorage();
      const current = getFallbackOrders();
      const match = current.find((o) => o._id === id);
      if (!match) {
        res.status(404);
        throw new Error('Order not found');
      }
      match.status = status;
      match.updatedAt = new Date().toISOString();
      fs.writeFileSync(DATA_FILE, JSON.stringify(current, null, 2), 'utf-8');
      order = match;
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Cancel order
// @route   DELETE /api/orders/:id
// @access  Public (Admin)
export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (global.isDbConnected) {
      const order = await Order.findById(id);
      if (!order) {
        res.status(404);
        throw new Error('Order not found');
      }
      await order.deleteOne();
    } else {
      initFallbackStorage();
      const current = getFallbackOrders();
      const filtered = current.filter((o) => o._id !== id);

      if (current.length === filtered.length) {
        res.status(404);
        throw new Error('Order not found');
      }

      fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      id: id,
    });
  } catch (error) {
    next(error);
  }
};
