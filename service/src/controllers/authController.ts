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

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (e.g., user already exists)
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/v1/users/verify-email/{token}:
 *   get:
 *     summary: Verify user email
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Email verified successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
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

/**
 * @swagger
 * /api/v1/users/resend-verification:
 *   post:
 *     summary: Resend verification email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address to resend verification to
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Verification email sent
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       429:
 *         description: Too many requests. Please wait before requesting another verification email.
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
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

/**
 * @swagger
 * /api/v1/users/delete-account:
 *   delete:
 *     summary: Soft delete user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account scheduled for deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Account scheduled for deletion. You can restore it within 30 days.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
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

/**
 * @swagger
 * /api/v1/users/restore-account:
 *   post:
 *     summary: Restore a soft-deleted account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Account restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Account restored successfully
 *                 token:
 *                   type: string
 *                   description: JWT token for the restored account
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Invalid credentials or account cannot be restored
 *       404:
 *         description: No deleted account found with this email
 *       410:
 *         description: Account cannot be restored as it was permanently deleted
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
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
