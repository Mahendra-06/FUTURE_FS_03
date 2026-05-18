import express from 'express';
import { submitContact, getContacts, deleteContact } from '../controllers/contactController.js';

const router = express.Router();

router.post('/', submitContact);
router.get('/', getContacts);
router.delete('/:id', deleteContact);

export default router;
