import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface VerifyEmailProps {
  otp: string;
}

const baseUrl = "https://alignxyz.vercel.app";

export const VerifyEmailTemplate = ({ otp }: VerifyEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Confirm your email address</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#000000",
                offwhite: "#fafafa",
              },
            },
          },
        }}
      >
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-dashed border-gray-200 rounded-xl my-[40px] mx-auto p-[20px] max-w-[465px] bg-white">
            <Section className="mt-[24px]">
              <Img
                src={`${baseUrl}/logo.png`}
                width="48"
                height="48"
                alt="Align"
                className="my-0 mx-auto"
              />
            </Section>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Heading className="text-black text-[20px] font-medium text-center p-0 mb-[16px] mx-0">
                Confirm your email address
              </Heading>
              <Text className="text-gray-500 text-[14px] leading-[24px] mb-[32px]">
                Enter the code below to complete your registration.
              </Text>

              <Section className="bg-gray-50 border border-solid border-gray-100 rounded-lg mx-auto w-fit px-8 py-2">
                <Text className="text-[32px] font-bold tracking-[0.2em] text-black m-0">
                  {otp}
                </Text>
              </Section>
            </Section>

            <Text className="text-gray-400 text-[12px] text-center mt-[32px]">
              This code expires in 10 minutes. <br />
              If you didn&apos;t request this code, you can safely ignore this
              email.
            </Text>

            <Hr className="border-gray-100 my-[24px] mx-0 w-full" />

            <Text className="text-gray-400 text-[10px] text-center tracking-wide uppercase">
              Align Network
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerifyEmailTemplate;
