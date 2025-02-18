import prisma from '../db/prisma.js';
import bcryptjs from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
export const signup = async (req, res, next) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }
        if (password !== confirmPassword) {
            res.status(400).json({ error: 'Passwords do not match' });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { username },
        });
        if (user) {
            res.status(400).json({ error: 'User already exists' });
            return;
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
        }
        else {
            res.status(400).json({ error: 'User not created, invalid user data' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { username },
        });
        if (!user) {
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }
        //compare password
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(400).json({ error: 'Invalid credentials' });
            return;
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
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ error: 'Internal server error', message: error.message });
    }
};
export const logout = async (req, res, next) => {
    try {
        res.cookie('jwt', '', {
            maxAge: 0,
        });
        res.status(200).json({ message: 'User logged out successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error  ' });
    }
};
export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json({
            user: {
                id: user.id,
                fullName: user.fullName,
                username: user.username,
                profilePic: user.profilePic,
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
