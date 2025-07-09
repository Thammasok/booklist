import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc: any, ret: any) {
        ret.id = ret._id;
        if (ret._id) {
          delete ret._id;
        }
        if (ret.__v !== undefined) {
          delete ret.__v;
        }
        return ret;
      },
    },
  }
);

// Create text index for search
categorySchema.index({ name: 'text', description: 'text' });

// Pre-save hook to generate slug from name
categorySchema.pre<ICategory>('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // remove special characters
      .replace(/\s+/g, '-') // replace spaces with -
      .replace(/-+/g, '-'); // replace multiple - with single -
  }
  next();
});

export const Category = mongoose.model<ICategory>('Category', categorySchema);
