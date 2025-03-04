import { render } from '@react-email/render';
import * as React from 'react';
import VerificationEmail from './verificationEmailTemplate'; // Ensure you have this import

export const verificationEmail = async (code: number, name: string) => {
  const emailContent = React.createElement(VerificationEmail, {
    verificationCode: code,
    name: name,
  });
  return await render(emailContent);
};
