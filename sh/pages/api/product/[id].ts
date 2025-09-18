// pages/api/products/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import dbConnect from '../../../lib/dbConnect';

// Define the product shape
interface Product {
  _id: mongoose.Types.ObjectId | string;
  name?: string;
  price?: number;
  image?: string;
  img?: string;
  brand?: string;
  description?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { id, category } = req.query;

  if (!id || !category) {
    return res.status(400).json({ success: false, message: 'Product ID and category are required.' });
  }

  try {
    // Ensure db exists before using
    if (!mongoose.connection.db) {
      throw new Error('Database not initialized');
    }

    // Get collection with correct typing
    const collection = mongoose.connection.db.collection<Product>(category as string);

    let item: Product | null = null;

    try {
      // Try as ObjectId
      const objectId = new mongoose.Types.ObjectId(id as string);
      item = await collection.findOne({ _id: objectId });
    } catch {
      // Fallback to string _id
      item = await collection.findOne({ _id: id as any });
    }

    if (!item) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Format product for frontend
    const formattedProduct = {
      _id: item._id.toString(),
      name: item.name ?? 'No Name',
      price: item.price ?? 0,
      image: item.image ?? item.img ?? '/placeholder.png',
      category: category as string,
      brand: item.brand ?? 'Unknown',
      description: item.description ?? '',
    };

    return res.status(200).json({ success: true, data: formattedProduct });
  } catch (err: any) {
    console.error('API Error:', err);

    if (err.message.includes('collection not found')) {
      return res.status(404).json({ success: false, message: `Category "${category}" not found.` });
    }

    return res.status(500).json({ success: false, message: 'Failed to fetch product details.' });
  }
}
