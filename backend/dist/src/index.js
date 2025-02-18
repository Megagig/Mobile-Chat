import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { app, server } from './socket/socket.js';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(cookieParser()); // for parsing cookies
app.use(express.json()); // for parsing application/json
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/messages', messageRoutes);
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
