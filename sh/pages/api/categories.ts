// E:\clothing-store\sh\pages\api\categories.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Await the database connection
    await dbConnect();

    if (req.method === 'GET') {
      // Check if the database connection is valid before proceeding
      if (!mongoose.connection.db) {
        throw new Error('Database connection is not ready.');
      }
      
      const collections = await mongoose.connection.db.listCollections().toArray();
      
      const categoryCollections = collections
        .filter(c => !['users', 'orders', 'fs.chunks', 'fs.files'].includes(c.name))
        .map(c => c.name);

      return res.status(200).json({ success: true, data: categoryCollections });
    } else {
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
  } catch (err: any) {
    console.error('API Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
}