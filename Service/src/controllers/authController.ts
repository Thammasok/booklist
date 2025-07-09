import { Request, Response } from 'express';
import crypto from 'crypto';
import { User, IUser, IUserDocument } from '../models/User';
import { sendVerificationEmail } from '../services/emailService';

// Extend the Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Create new user with default role 'user'
    const user = new User({
      username,
      email,
      password,
      role: 'user',
      isVerified: false,
      isDeleted: false
    });

    // Generate and save verification token
    const verificationToken = user.generateVerificationToken();
    await user.save();

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken, user.username);

    // Remove sensitive data before sending response
    const userObj = user.toObject();
    const { password: _, verificationToken: token, verificationExpires: expires, ...userResponse } = userObj;

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      data: userResponse
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering user',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Verify user email
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    
    // Hash the token to match the one in the database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user by verification token that hasn't expired
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Update user
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. You can now log in.'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error verifying email',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Resend verification email
export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'This account has already been verified. Please log in.'
      });
    }

    // Generate new verification token
    const verificationToken = user.generateVerificationToken();
    await user.save();

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken, user.username);

    res.status(200).json({
      success: true,
      message: 'Verification email sent. Please check your email.'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error resending verification email',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Soft delete user account
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete the user
    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Your account has been deactivated. You can recover it within 30 days.'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Restore soft-deleted account
export const restoreAccount = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    // Find the user including soft-deleted ones
    const user = await User.findOne({ email, isDeleted: true });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No deactivated account found with this email address or account is permanently deleted.'
      });
    }

    // Check if account can be restored (within 30 days of deletion)
    const daysSinceDeletion = Math.floor(
      (Date.now() - (user.deletedAt?.getTime() || 0)) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceDeletion > 30) {
      return res.status(400).json({
        success: false,
        message: 'Account cannot be restored as it has been deactivated for more than 30 days.'
      });
    }

    // Restore the user
    user.isDeleted = false;
    user.deletedAt = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account has been restored successfully. You can now log in.'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error restoring account',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};
