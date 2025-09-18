// pages/api/auth/current_user.js
import { protect } from '../../../middleware/auth';

const handler = (req, res) => {
  // The 'req.user' object is available because the 'protect' middleware has run
  // and successfully authenticated the user.
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  } else {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
};

// We wrap our handler with the 'protect' middleware
export default protect(handler);
