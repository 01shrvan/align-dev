import {
  Body,
  Container,
  Head,
  Html,
  Tailwind,
  Text,
} from "@react-email/components";

const VerifyEmailTemplate = (props: { otp: string }) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white max-w-[600px] mx-auto p-[40px]">
            <Text className="text-[24px] font-bold text-black mb-[24px] mt-0">
              Verify your email address
            </Text>

            <Text className="text-[16px] text-gray-700 mb-[32px] mt-0">
              Please use the following verification code to complete your
              registration:
            </Text>

            <Text className="text-[32px] font-bold text-black mb-[32px] mt-0 text-center bg-gray-50 p-[16px] border border-solid border-gray-200">
              {props.otp}
            </Text>

            <Text className="text-[16px] text-gray-700 mb-[32px] mt-0">
              This code will expire in 10 minutes. If you didn&apos;t request
              this verification, please ignore this email.
            </Text>

            <Text className="text-[14px] text-gray-500 mt-[40px] mb-0">
              Best regards,
              <br />
              The Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerifyEmailTemplate;
