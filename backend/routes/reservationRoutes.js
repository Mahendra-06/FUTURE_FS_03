import express from 'express';
import { createReservation, getReservations, deleteReservation } from '../controllers/reservationController.js';

const router = express.Router();

// Support both POST /reservation and POST /reservations
// Support GET /reservations
router.route('/')
  .post(createReservation)
  .get(getReservations);

// Support DELETE /api/reservation/:id and DELETE /api/reservations/:id
router.route('/:id')
  .delete(deleteReservation);

export default router;
