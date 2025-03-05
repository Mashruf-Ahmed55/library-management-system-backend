import { render } from '@react-email/render';
import * as React from 'react';
import VerificationEmail from './verificationEmailTemplate';

export const verificationEmail = (code: number, name: string) => {
  const emailContent = React.createElement(VerificationEmail, {
    verificationCode: code.toString(),
    name: name,
  });

  return render(emailContent);
};
