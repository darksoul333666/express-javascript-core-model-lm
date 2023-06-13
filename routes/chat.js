import express from 'express';
import ChatController from '../src/controllers/ChatController.js';

const router = express.Router();

/* POST chat */
router.post('/', ChatController);

export default router;
