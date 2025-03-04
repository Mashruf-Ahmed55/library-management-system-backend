import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Tailwind,
  Text,
} from '@react-email/components';
interface VerificationEmailProps {
  name: string;
  verificationCode: number;
}

export default function VerificationEmail({
  name,
  verificationCode,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-100 text-gray-900">
          <Container className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
            <Heading className="text-xl font-bold text-center text-blue-600">
              Verify Your Email Address
            </Heading>
            <Text className="text-lg text-gray-700">
              Hi {name},<br /> Thank you for signing up! Please verify your
              email using the code below:
            </Text>
            <Text className="text-2xl font-bold text-center text-red-500 tracking-widest">
              {verificationCode}
            </Text>
            <Text className="text-sm text-gray-600 mt-4">
              If you didn't request this, please ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
