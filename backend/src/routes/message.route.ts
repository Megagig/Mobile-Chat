import e from 'express';
import express from 'express';

const messageRoutes = express.Router();

messageRoutes.post('/', (req, res) => {
  console.log(req.body);
  res.send('Hello World!');
});

export default messageRoutes;
