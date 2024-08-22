import mongoose from 'mongoose';

export interface IUser {
  username: string;
  password: string;
  role: string;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

export const User = mongoose.model<IUser>('User', userSchema);
