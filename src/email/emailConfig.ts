import nodemailer from 'nodemailer';
import { config } from '../config/config';
import { verificationEmail } from './emailTemplates';

const generateVerificationOtpEmailTemplate = (code: number, name: string) => {
  return verificationEmail(code, name);
};

const sendEmail = async (email: string, subject: string, message: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.NODEMAILER_HOST as string,
      port: Number(config.NODEMAILER_PORT),
      secure: Number(config.NODEMAILER_PORT) === 465,
      auth: {
        user: config.NODEMAILER_USER as string,
        pass: config.NODEMAILER_PASS as string,
      },
    });

    const info = await transporter.sendMail({
      from: `"No Reply" <${config.NODEMAILER_USER}>`,
      to: email,
      subject: subject,
      html: message,
    });
  } catch (error: any) {
    console.error('❌ Error sending email:', error.message);
    console.error('Error details:', error.response || error.stack);
    throw new Error('Email sending failed');
  }
};

export const sendVerificationCode = async (
  verificationCode: number,
  email: string,
  name: string
) => {
  try {
    const message = await generateVerificationOtpEmailTemplate(
      verificationCode,
      name
    );
    await sendEmail(email, 'Verification Code', message);
  } catch (error: any) {
    console.error('❌ Error in sending verification code:', error.message);
  }
};
