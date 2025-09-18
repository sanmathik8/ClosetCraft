import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IShippingAddress {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phoneNumber?: string;
  shippingAddress?: IShippingAddress;
}

const ShippingAddressSchema: Schema = new Schema({
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: String },
});

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  phoneNumber: { type: String },
  shippingAddress: { type: ShippingAddressSchema, required: false },
}, { timestamps: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
