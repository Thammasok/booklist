import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// User role type
type UserRole = 'user' | 'admin';

// Base user interface
interface IUserBase {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  verificationToken?: string;
  verificationExpires?: Date;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for User document (instance methods)
interface IUserDocument extends IUserBase, Document {
  _id: mongoose.Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateVerificationToken(): string;
  softDelete(): Promise<this>;
}

// Interface for User model (static methods)
interface IUserModel extends Model<IUserDocument> {
  findActive(criteria?: any): Promise<IUserDocument[]>;
}

// Export types
type IUser = IUserBase;
type IUserModelType = IUserModel;
type IUserDocumentType = IUserDocument;

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot be more than 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationExpires: {
      type: Date,
      select: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    deletedAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (
  this: IUserDocument,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate verification token
userSchema.methods.generateVerificationToken = function(this: IUserDocument): string {
  const token = crypto.randomBytes(32).toString('hex');
  this.verificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  // Token expires in 24 hours
  this.verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  return token;
};

// Soft delete method
userSchema.methods.softDelete = function(this: IUserDocument): Promise<IUserDocument> {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

// Query middleware to exclude deleted users from queries
userSchema.pre(/^find/, function(this: any, next) {
  // Only apply to queries that are not explicitly checking for deleted users
  if (this.getFilter().isDeleted === undefined) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

// Static method to find non-deleted users
userSchema.statics.findActive = function(criteria = {}) {
  return this.find({ ...criteria, isDeleted: false });
};

// Create and export the model
const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export { User };
export type { IUser, IUserModelType as IUserModel, IUserDocumentType as IUserDocument, UserRole };
