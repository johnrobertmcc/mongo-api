import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter an appropriate name.'],
    },
    email: {
      type: String,
      required: [true, 'Missing a valid email.'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Missing a valid password'],
    },
    tags: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', UserSchema);
