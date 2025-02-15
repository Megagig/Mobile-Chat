import express from 'express';
import { getMessages, sendMessage } from '../controllers/message.controller.js';
import protectedRoute from '../middleware/protectedRoute.js';

const messageRoutes = express.Router();

messageRoutes.post('/send/:id', protectedRoute, sendMessage);
messageRoutes.get('/:id', protectedRoute, getMessages);

export default messageRoutes;
