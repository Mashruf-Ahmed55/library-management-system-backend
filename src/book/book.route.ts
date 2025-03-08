import { Router } from 'express';
import { isAuthenticed, isAuthorized } from '../middlewares/authMiddlewares';
import { allBooks, createBook, deleteBook } from './book.controller';

const bookRouter = Router();

bookRouter
  .route('/create-book')
  .post(isAuthenticed, isAuthorized('Admin'), createBook);
bookRouter
  .route('/delete-book/:id')
  .delete(isAuthenticed, isAuthorized('Admin'), deleteBook);
bookRouter.route('/all-books').get(isAuthenticed, allBooks);

export default bookRouter;
