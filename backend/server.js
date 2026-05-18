import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import reservationRoutes from './routes/reservationRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Initialize env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome status check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Noir & Brew Luxury Café & Bar API — Online & Healthy 🕯️',
  });
});

// Mount Routes
app.use('/api/reservation', reservationRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);

// Catch-all route not found
app.use('*', (req, res, next) => {
  res.status(404);
  next(new Error(`Endpoint ${req.originalUrl} not found`));
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🕯️ Noir & Brew Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
