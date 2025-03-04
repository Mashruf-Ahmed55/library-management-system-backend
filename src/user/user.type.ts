interface IBorrowedBook {
  bookId: String;
  returned: boolean;
  bookTitle?: string;
  borrowedDate?: Date;
  dueDate?: Date;
}
interface avatar {
  public_id: String;
  url: String;
}
export interface IUser {
  name: string;
  email: string;
  password: string;
  role: string;
  accountVerified: boolean;
  borrowBooks: IBorrowedBook[];
  avatar: avatar;
  verificationCode: Number;
  verificationCodeExpire: Date;
  resetPasswordToken: String;
  resetPasswordTokenExpire: Date;
  generateVerificationCodes: () => Promise<number>;
}
