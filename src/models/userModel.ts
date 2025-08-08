import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  correctPassword(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean>;
  googleId?: string; // Optional field for OAuth users
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: {
      type: String,
      allowNull: true, // This field will only be populated for OAuth users
    },
  },
  { timestamps: true },
);

// 🔹 Hash Password Before Saving
UserSchema.pre('save', async function (this: IUser & Document, next) {
  if (!this.isModified('password')) return next();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

// 🔹 Method to Check Password
UserSchema.methods.correctPassword = async function (
  this: IUser & Document,
  candidatePassword: string,
  userPassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, userPassword);
};

export const User = mongoose.model<IUser>('User', UserSchema);
