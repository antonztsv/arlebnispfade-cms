import config from '@/config';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '@/models/User';
import dotenv from 'dotenv';
dotenv.config();

if (!config.jwtSecret) {
  throw new Error('JWT_SECRET must be set in .env');
}
const JWT_SECRET = config.jwtSecret;

export const register = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        JWT_SECRET,
        {
          expiresIn: '1h',
        },
      );
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};
