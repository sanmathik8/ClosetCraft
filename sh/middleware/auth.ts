import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';
import dbConnect from '../lib/dbConnect';
import User, { IUser } from '../models/User';

// Extending NextApiRequest to include a user property
export interface NextApiRequestWithUser extends NextApiRequest {
  user?: IUser;
}

export const protect = (handler: NextApiHandler) => async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  let token;
  // Check for the 'Authorization' header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      // Connect to the database
      await dbConnect();
      
      // Fetch the user from the database and attach it to the request object
      req.user = await User.findById(decoded.id).select('-password');

      // If user is not found, return an error
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      // Proceed to the next handler
      return handler(req, res);

    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  // If no token is provided, return an error
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};
