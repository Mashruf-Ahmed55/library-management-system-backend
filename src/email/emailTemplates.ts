import { render } from '@react-email/render';
import * as React from 'react';
import { ResetPasswordEmail, VerificationEmail } from './emailTemplate';

export const verificationEmail = (code: number, name: string) => {
  const emailContent = React.createElement(VerificationEmail, {
    verificationCode: code.toString(),
    name: name,
  });

  return render(emailContent);
};

export const sendResetPasswordEmailTemplates = (url: string, name: string) => {
  const emailContent = React.createElement(ResetPasswordEmail, {
    url: url,
    name: name,
  });
  return render(emailContent);
};
