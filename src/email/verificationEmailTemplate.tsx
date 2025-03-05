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
  verificationCode: string;
}

export default function VerificationEmail({
  name,
  verificationCode,
}: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Tailwind>
        <Body style={{ backgroundColor: '#f3f4f6', color: '#111827' }}>
          <Container
            style={{
              maxWidth: '600px',
              margin: '20px auto',
              padding: '24px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Heading
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#2563eb',
              }}
            >
              Verify Your Email Address
            </Heading>
            <Text
              style={{
                fontSize: '16px',
                color: '#374151',
                marginTop: '16px',
              }}
            >
              Hi {name},<br /> Thank you for signing up! Please verify your
              email using the code below:
            </Text>
            <Text
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#ef4444',
                letterSpacing: '2px',
              }}
            >
              {verificationCode}
            </Text>
            <Text
              style={{ fontSize: '14px', color: '#6b7280', marginTop: '16px' }}
            >
              If you didn't request this, please ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
