// E:\clothing-store\sh\pages\api\products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import mongoose from 'mongoose';
import { IProduct } from '../../types';

const PAGE_SIZE = 8;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let category: string | undefined;

  try {
    // 1. Connect to the database
    await dbConnect();

    // 2. Only handle GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { page } = req.query;
    category = req.query.category as string | undefined;
    const pageNumber = parseInt(page as string) || 1;

    // 3. Validate database connection
    if (!mongoose.connection.db) {
      throw new Error('Database connection is not ready.');
    }

    // 4. Validate category parameter
    if (!category) {
      return res.status(400).json({ success: false, message: 'Category parameter is required.' });
    }

    // 5. Check if the collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (!collectionNames.includes(category)) {
      return res.status(404).json({ success: false, message: `Category "${category}" not found.` });
    }

    // 6. Access the collection and fetch products with pagination
    const collection = mongoose.connection.db.collection(category);
    const total = await collection.countDocuments({});
    const items = await collection.find({})
      .skip((pageNumber - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .toArray();

    // 7. Format products safely for frontend
    const formattedProducts: IProduct[] = items.map((item: any): IProduct => ({
      _id: item._id ? item._id.toString() : '', // always string
      name: item.name || 'No Name',
      price: typeof item.price === 'number' ? item.price : 0,
      image: item.image || item.img || '/placeholder.png',
      category: category || 'unknown',
      description: item.description || '',
      brand: item.brand || 'N/A'
    }));

    // 8. Return response
    return res.status(200).json({ success: true, data: formattedProducts, total });

  } catch (err: any) {
    // 9. Centralized error handling
    console.error('API Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products.',
      error: err.message
    });
  }
}
