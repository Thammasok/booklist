import { Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User, IUserDocument } from '../models/User';

// Extend the Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

interface JwtPayload {
  id: string;
  email: string;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Create new user
    const user: IUserDocument = new User({
      username,
      email,
      password
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { 
        id: (user._id as mongoose.Types.ObjectId).toString(), 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    // Remove password from output
    const userResponse = user.toObject();
    if ('password' in userResponse) {
      delete (userResponse as any).password;
    }

    res.status(201).json({
      success: true,
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering user',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/v1/users/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password +isVerified +isDeleted');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is deleted
    if (user.isDeleted) {
      return res.status(401).json({
        success: false,
        message: 'This account has been deactivated. Please contact support to restore your account.'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email address before logging in',
        requiresVerification: true
      });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRE || '30d' } as jwt.SignOptions
    );

    // Remove sensitive data from response
    const { password: _, verificationToken, verificationExpires, ...userResponse } = user.toObject();

    res.status(200).json({
      success: true,
      token,
      data: userResponse
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/users/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const user = await User.findById(req.user._id)
      .select('-password -verificationToken -verificationExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};
