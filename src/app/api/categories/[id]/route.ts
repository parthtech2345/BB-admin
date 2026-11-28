import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Category } from '@/models/Category';
import { getAuthUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, category });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const {
      name,
      slug,
      description,
      order,
      status,
      subCategories,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      schemaMarkup,
    } = body;

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (name) category.name = name.trim();
    if (slug) {
      category.slug = slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    if (description !== undefined) category.description = description;
    if (order !== undefined) category.order = Number(order);
    if (status) category.status = status;
    if (metaTitle !== undefined) category.metaTitle = metaTitle;
    if (metaDescription !== undefined) category.metaDescription = metaDescription;
    if (metaKeywords !== undefined) category.metaKeywords = metaKeywords;
    if (canonicalUrl !== undefined) category.canonicalUrl = canonicalUrl;
    if (schemaMarkup !== undefined) category.schemaMarkup = schemaMarkup;

    if (Array.isArray(subCategories)) {
      category.subCategories = subCategories.map((sub: any) => ({
        _id: sub._id,
        name: sub.name,
        slug: (sub.slug || sub.name)
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, ''),
        description: sub.description || '',
        order: Number(sub.order) || 0,
        status: sub.status || 'active',
        metaTitle: sub.metaTitle || '',
        metaDescription: sub.metaDescription || '',
        metaKeywords: sub.metaKeywords || '',
        canonicalUrl: sub.canonicalUrl || '',
        schemaMarkup: sub.schemaMarkup || '',
      })) as any;
    }

    await category.save();

    return NextResponse.json({ success: true, category });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
