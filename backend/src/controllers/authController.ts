import config from '@/config';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '@/models/User';
import { userSchema, loginSchema, UserInput, LoginInput } from '@/schemas/authSchema';
import dotenv from 'dotenv';
dotenv.config();

if (!config.jwtSecret) {
  throw new Error('JWT_SECRET must be set in .env');
}
const JWT_SECRET = config.jwtSecret;

export const register = async (req: Request, res: Response) => {
  try {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: 'Invalid input', errors: result.error.errors });
    }

    const { username, password, role } = result.data as UserInput;

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
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: 'Invalid input', errors: result.error.errors });
    }

    const { username, password } = result.data as LoginInput;

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
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};
