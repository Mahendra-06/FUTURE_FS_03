import fs from 'fs';
import path from 'path';
import Contact from '../models/Contact.js';

const isVercel = !!process.env.VERCEL;
const SOURCE_DIR = path.resolve('data');
const DATA_DIR = isVercel ? path.join('/tmp', 'data') : SOURCE_DIR;
const DATA_FILE = path.join(DATA_DIR, 'contacts.json');

// Ensure data folder and file exists
const initFallbackStorage = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const sourceFile = path.join(SOURCE_DIR, 'contacts.json');
    if (isVercel && fs.existsSync(sourceFile)) {
      try {
        fs.copyFileSync(sourceFile, DATA_FILE);
      } catch (err) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
      }
    } else {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  }
};

const getFallbackContacts = () => {
  initFallbackStorage();
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    return [];
  }
};

const saveFallbackContact = (newContact) => {
  const current = getFallbackContacts();
  current.unshift(newContact);
  fs.writeFileSync(DATA_FILE, JSON.stringify(current, null, 2), 'utf-8');
  return newContact;
};

// @desc    Submit a contact inquiry message
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400);
      throw new Error('Please fill in all contact message fields');
    }

    let contact;

    if (global.isDbConnected) {
      contact = await Contact.create({
        name,
        email,
        subject,
        message,
      });
    } else {
      // Local fallback
      contact = {
        _id: `con-${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        subject,
        message,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveFallbackContact(contact);
    }

    res.status(201).json({
      success: true,
      message: 'Contact message received successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Retrieve all contact inquiries
// @route   GET /api/contact
// @access  Private/Admin
export const getContacts = async (req, res, next) => {
  try {
    let contacts;
    if (global.isDbConnected) {
      contacts = await Contact.find().sort({ createdAt: -1 });
    } else {
      contacts = getFallbackContacts();
    }

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a contact inquiry
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (global.isDbConnected) {
      const contact = await Contact.findById(id);
      if (!contact) {
        res.status(404);
        throw new Error('Contact inquiry not found');
      }
      await contact.deleteOne();
    } else {
      const current = getFallbackContacts();
      const filtered = current.filter((c) => c._id !== id);
      fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
