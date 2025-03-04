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
      secure: false,
      auth: {
        user: config.NODEMAILER_USER as string,
        pass: config.NODEMAILER_PASS as string,
      },
    });

    await transporter.sendMail({
      from: config.NODEMAILER_USER,
      to: email,
      subject: subject,
      html: message,
    });

    console.log('✅ Email sent successfully!');
  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    console.error('Error details:', error.response || error.message);
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
    console.log('✅ Verification code sent successfully!');
  } catch (error: any) {
    console.error('❌ Error in sending verification code:', error);
  }
};
