import express from 'express';

const authRoutes = express.Router();

authRoutes.post('/login', (req, res) => {
  console.log(req.body);
  res.send('Hello World!');
});

authRoutes.post('/logout', (req, res) => {
  res.send('Hello World!');
});

authRoutes.post('/signup', (req, res) => {
  console.log(req.body);
  res.send('Hello World!');
});

export default authRoutes;
