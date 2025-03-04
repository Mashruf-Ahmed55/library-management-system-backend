import { render } from '@react-email/render';
import * as React from 'react';
import VerificationEmail from './verificationEmailTemplate'; // Ensure you have this import

export const verificationEmail = async (code: number, name: string) => {
  const emailContent = React.createElement(VerificationEmail, {
    verificationCode: code.toString(), // Number থেকে String করা হয়েছে
    name: name,
  });

  return render(emailContent); // render() অ্যাসিনক্রোনাস নয়, তাই await দরকার নেই
};
