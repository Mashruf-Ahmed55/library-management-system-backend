import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components';

interface VerificationEmailProps {
  name: string;
  verificationCode: string;
}

export function VerificationEmail({
  name,
  verificationCode,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded-lg bg-white p-8">
            <Heading className="text-2xl font-bold text-gray-900">
              Verify your email address
            </Heading>
            <Text className="text-gray-600">
              Hi {name},
              <br />
              Thanks for signing up! Please verify your email address to get
              started.
            </Text>
            <Text className="text-sm text-gray-600">
              Your verification code is:{' '}
              <strong className="tracking-tight">{verificationCode}</strong>
            </Text>
            <Hr className="my-6 border-gray-200" />
            <Text className="text-xs text-gray-500">
              If the button above doesn't work, copy and paste this URL into
              your browser:
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export function ResetPasswordEmail({
  url,
  name,
}: {
  url: string;
  name: string;
}) {
  return (
    <Html>
      <Head />
      <Body className="bg-gray-100 text-gray-900">
        <Container className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <Heading className="text-xl font-semibold text-center">
            Reset Your Password
          </Heading>
          <Text className="text-gray-600 text-center">
            Hi {name},
            <br />
            You requested to reset your password. Click the button below to set
            a new password.
          </Text>
          <div className="text-center mt-4">
            <Button
              href={url}
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
            >
              Reset Password
            </Button>
          </div>
          <Text className="text-gray-500 text-sm text-center mt-4">{url}</Text>
          <Text className="text-gray-500 text-sm text-center mt-4">
            If you didn’t request a password reset, you can safely ignore this
            email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
