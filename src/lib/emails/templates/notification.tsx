import {
  Body,
  Button,
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

interface NotificationTemplateProps {
  recipientName?: string;
  issuerName: string;
  actionText: string;
  actionUrl: string;
}

const baseUrl = "https://alignxyz.vercel.app";

export default function NotificationTemplate({
  recipientName,
  issuerName,
  actionText,
  actionUrl,
}: NotificationTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>{`${issuerName} ${actionText}`}</Preview>
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

            <Section className="text-center mt-[32px] mb-[24px]">
              <Heading className="text-black text-[20px] font-medium text-center p-0 mb-[16px] mx-0">
                New notification
              </Heading>
              <Text className="text-gray-500 text-[14px] leading-[24px] mb-[20px]">
                {recipientName ? `Hi ${recipientName}, ` : ""}
                {issuerName} {actionText}.
              </Text>
              <Button
                className="bg-black rounded-lg text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={actionUrl}
              >
                View notification
              </Button>
            </Section>

            <Text className="text-gray-400 text-[12px] text-center mt-[24px]">
              You&apos;re receiving this because notification emails are enabled
              for your account.
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
}
