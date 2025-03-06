import {
  Body,
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

export default function VerificationEmail({
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
