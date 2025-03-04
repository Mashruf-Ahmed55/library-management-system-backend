import { Response } from 'express';
import { verificationEmail } from './emailTemplates';

const generateVerificationOtpEmailTemplate = (code: number, name: string) => {
  return verificationEmail(code, name);
};

export const sendVerificationCode = (
  verificationCode: number,
  email: string,
  name: string,
  res: Response
) => {
  try {
    const message = generateVerificationOtpEmailTemplate(
      verificationCode,
      name
    );
    // sendEmai({
    //   email,
    //   subject: 'Verification code sent successfully',
    //   message,
    // });
    res.status(200).json({
      success: true,
      message: 'Verification code sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Verification code send faid',
    });
  }
};
