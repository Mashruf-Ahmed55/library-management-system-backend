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
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  accountVerified: boolean;
  borrowBooks: IBorrowedBook[];
  avatar: {
    public_id: string;
    url: string;
  };
  verificationCode: number | null;
  verificationCodeExpire: Date | null;
  resetPasswordToken: string | null;
  resetPasswordTokenExpire: Date | null;
  generateVerificationCodes: () => Promise<number>;
  generateResetPasswordToken: () => Promise<string>;
}
