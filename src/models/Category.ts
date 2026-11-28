import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubCategory {
  _id?: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  order?: number;
  status: 'active' | 'inactive';
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  schemaMarkup?: string;
}

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  order: number;
  status: 'active' | 'inactive';
  subCategories: ISubCategory[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  schemaMarkup?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubCategorySchema = new Schema<ISubCategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaKeywords: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
    schemaMarkup: { type: String, default: '' },
  },
  { timestamps: true }
);

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    subCategories: [SubCategorySchema],
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaKeywords: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
    schemaMarkup: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
