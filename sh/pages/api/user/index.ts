import type { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../../lib/dbConnect";
import User from "../../../models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongo();

  const { method } = req;

  if (method === "GET") {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ user });
  }

  if (method === "PUT") {
    const { email, name, phoneNumber, shippingAddress } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name;
    user.phoneNumber = phoneNumber;
    user.shippingAddress = shippingAddress;
    await user.save();
    return res.status(200).json({ message: "Profile updated successfully" });
  }

  res.status(405).end();
}
