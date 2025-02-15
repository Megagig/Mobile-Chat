import express from 'express';
import { sendMessage } from '../controllers/message.controller.js';
import protectedRoute from '../middleware/protectedRoute.js';

const messageRoutes = express.Router();

messageRoutes.post('/send/:id', protectedRoute, sendMessage);

export default messageRoutes;
