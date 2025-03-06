import otpGenerator from 'otp-generator';

export const generateVerificationCode = () => {
  let otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  otp = otp.replace(/0/g, '');
  while (otp.length < 6) {
    otp += Math.floor(Math.random() * 10);
  }

  return otp;
};
