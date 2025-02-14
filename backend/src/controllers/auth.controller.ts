import { Request, Response } from 'express';
import prisma from '../db/prisma.js';
import bcryptjs from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    //Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // https://avatar-placeholder.iran.liara.run/
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await prisma.user.create({
      data: {
        fullName,
        username,
        password: hashedPassword,
        gender,
        profilePic: gender === 'male' ? boyProfilePic : girlProfilePic,
      },
    });

    if (newUser) {
      //generate token
      generateToken(newUser.id, res);
      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          username: newUser.username,
          boyProfilePic: newUser.profilePic,
        },
      });
    } else {
      res.status(400).json({ error: 'User not created, invalid user data' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    //compare password
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    //generate token  and send response
    generateToken(user.id, res);
    res.status(200).json({
      message: 'User logged in successfully',
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        boyProfilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie('jwt', '', {
      maxAge: 0,
    });
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error  ' });
  }
};
