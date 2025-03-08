import { Types } from 'mongoose';

export interface IBook {
  _id?: Types.ObjectId;
  title: string;
  author: string;
  description: string;
  price: number;
  quantity: number;
  availability: boolean;
  createdAt: Date;
  updatedAt: Date;
}
