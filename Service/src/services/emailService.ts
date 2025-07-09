import nodemailer from 'nodemailer';
import { config } from 'dotenv';

// Load environment variables
config();

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Function to send verification email
export const sendVerificationEmail = async (
  email: string,
  token: string,
  username: string
) => {
  try {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Our Platform, ${username}!</h2>
          <p>Thank you for registering. Please verify your email address to get started.</p>
          <p>Click the button below to verify your email address:</p>
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 10px 20px; 
                    background-color: #4CAF50; color: white; 
                    text-decoration: none; border-radius: 5px; 
                    margin: 20px 0;">
            Verify Email
          </a>
          <p>Or copy and paste this link into your browser:</p>
          <p>${verificationUrl}</p>
          <p>If you did not create an account, please ignore this email.</p>
          <p>Best regards,<br/>The Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Function to send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  username: string
) => {
  try {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${username},</h2>
          <p>You recently requested to reset your password. Click the button below to reset it.</p>
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 10px 20px; 
                    background-color: #4CAF50; color: white; 
                    text-decoration: none; border-radius: 5px; 
                    margin: 20px 0;">
            Reset Password
          </a>
          <p>Or copy and paste this link into your browser:</p>
          <p>${resetUrl}</p>
          <p>This password reset link will expire in 1 hour.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Best regards,<br/>The Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Function to send account deletion confirmation
export const sendAccountDeletionEmail = async (
  email: string,
  username: string
) => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: email,
      subject: 'Your Account Has Been Deactivated',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Goodbye, ${username}!</h2>
          <p>Your account has been deactivated as requested.</p>
          <p>If this was a mistake, you have 30 days to recover your account by logging in again.</p>
          <p>After 30 days, your account and all associated data will be permanently deleted.</p>
          <p>We're sorry to see you go. If you change your mind, we'd love to have you back!</p>
          <p>Best regards,<br/>The Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Account deletion email sent to ${email}`);
  } catch (error) {
    console.error('Error sending account deletion email:', error);
    throw new Error('Failed to send account deletion email');
  }
};
