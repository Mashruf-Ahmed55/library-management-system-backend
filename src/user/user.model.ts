import jwt from 'jsonwebtoken';
import { model, Schema } from 'mongoose';
import { config } from '../config/config';
import { generateVerificationCode } from '../config/utils';
import { IUser } from './user.type';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        message: 'Invalid email format',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['Admin', 'User'],
      default: 'User',
    },
    accountVerified: {
      type: Boolean,
      default: false,
    },
    borrowBooks: [
      {
        bookId: {
          type: Schema.Types.ObjectId,
          ref: 'Borrow',
        },
        returned: {
          type: Boolean,
          default: false,
        },
        bookTitle: String,
        borrowedDate: Date,
        dueDate: Date,
      },
    ],
    avatar: {
      public_id: String,
      url: String,
    },
    verificationCode: {
      type: String,
      default: null,
    },
    verificationCodeExpire: {
      type: Date,
      default: null,
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
  },
  {
    timestamps: true,
  }
);

// ✅ Updated method to be async and save changes to DB
userSchema.methods.generateVerificationCodes = async function () {
  const verificationCode = generateVerificationCode().toString();

  this.verificationCode = verificationCode;
  this.verificationCodeExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  await this.save(); //
  return verificationCode;
};

userSchema.methods.generateResetPasswordToken = async function () {
  const resetPasswordToken = jwt.sign(
    { _id: this._id },
    config.RESET_PASSWORD_SECRET as string,
    {
      expiresIn: '15m',
    }
  );

  this.resetPasswordToken = resetPasswordToken;
  this.resetPasswordTokenExpire = new Date(Date.now() + 15 * 60 * 1000);
  await this.save();
  return resetPasswordToken;
};
export default model<IUser>('User', userSchema);
