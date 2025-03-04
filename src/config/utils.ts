import otpGenerator from 'otp-generator';
export const generateVerificationCode = () => {
  return parseInt(
    otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    })
  );
};

