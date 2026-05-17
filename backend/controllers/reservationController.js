import fs from 'fs';
import path from 'path';
import Reservation from '../models/Reservation.js';

const DATA_DIR = path.resolve('data');
const DATA_FILE = path.join(DATA_DIR, 'reservations.json');

// Ensure data folder and file exists
const initFallbackStorage = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
};

const getFallbackReservations = () => {
  initFallbackStorage();
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    return [];
  }
};

const saveFallbackReservation = (newRes) => {
  const current = getFallbackReservations();
  current.unshift(newRes); // Insert at beginning (newest first)
  fs.writeFileSync(DATA_FILE, JSON.stringify(current, null, 2), 'utf-8');
  return newRes;
};

// @desc    Create a new table reservation
// @route   POST /api/reservation
// @access  Public
export const createReservation = async (req, res, next) => {
  try {
    const { name, email, phone, guests, date, time } = req.body;

    // Direct sanity check
    if (!name || !email || !phone || !guests || !date || !time) {
      res.status(400);
      throw new Error('Please fill in all reservation fields');
    }

    let reservation;

    if (global.isDbConnected) {
      reservation = await Reservation.create({
        name,
        email,
        phone,
        guests: Number(guests),
        date,
        time,
      });
    } else {
      // Local fallback
      reservation = {
        _id: `res-${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        phone,
        guests: Number(guests),
        date,
        time,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveFallbackReservation(reservation);
    }

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Public
export const getReservations = async (req, res, next) => {
  try {
    let reservations;

    if (global.isDbConnected) {
      reservations = await Reservation.find({}).sort({ createdAt: -1 });
    } else {
      reservations = getFallbackReservations();
    }

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a reservation
// @route   DELETE /api/reservations/:id
// @access  Public (Admin)
export const deleteReservation = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (global.isDbConnected) {
      const reservation = await Reservation.findById(id);
      if (!reservation) {
        res.status(404);
        throw new Error('Reservation not found');
      }
      await reservation.deleteOne();
    } else {
      initFallbackStorage();
      const current = getFallbackReservations();
      const filtered = current.filter(r => r._id !== id);
      
      if (current.length === filtered.length) {
        res.status(404);
        throw new Error('Reservation not found');
      }

      fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    }

    res.status(200).json({
      success: true,
      message: 'Reservation cancelled successfully',
      id: id
    });
  } catch (error) {
    next(error);
  }
};
