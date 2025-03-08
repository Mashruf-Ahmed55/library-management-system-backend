import { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import bookModel from './book.model';

export const createBook = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, author, description, price, quantity } = req.body;

    if (!title || !author || !description || !price || !quantity) {
      return next(createHttpError(400, 'All details are requried'));
    }
    try {
      const newBook = await bookModel.create({
        title,
        author,
        description,
        price,
        quantity,
      });
      res.status(201).json({
        success: true,
        message: 'Book Created Successfully',
        book: {
          title: newBook.title,
          description: newBook.description,
        },
      });
    } catch (error) {
      return next(createHttpError(500, 'Internal Server error'));
    }
  }
);

export const deleteBook = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const book = await bookModel.findById(id);
      if (!book) {
        return next(createHttpError(400, 'Book not found'));
      }
      await book.deleteOne();
      res.status(200).json({
        success: true,
        message: 'Book deleted Successfully',
      });
    } catch (error) {
      return next(createHttpError(500, 'Internal Server Error'));
    }
  }
);

export const allBooks = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const books = await bookModel.find({});
      res.status(200).json({
        success: true,
        books,
      });
    } catch (error) {
      return next(createHttpError(500, 'Internal Server Error'));
    }
  }
);
export const updateBook = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);
