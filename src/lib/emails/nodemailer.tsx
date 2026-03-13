import { render } from "@react-email/render";
import { createTransport, type Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import * as React from "react";
import type { Result } from "../types";
import VerifyEmailTemplate from "./templates/verify-email";
import ResetPasswordTemplate from "./templates/reset-password";
import NotificationTemplate from "./templates/notification";

export class NodemailerUtils {
  private readonly transporter: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;
  private readonly from: string;

  constructor() {
    const smtpPort = Number.parseInt(process.env.SMTP_PORT || "587", 10);

    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number.isNaN(smtpPort) ? 587 : smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    this.from =
      process.env.SMTP_FROM || "Align Network <noreply@mail.align-network.xyz>";
  }

  async sendVerificationEmail(to: string, otp: string): Promise<Result<null>> {
    try {
      await this.transporter.sendMail({
        from: this.from,
        to,
        subject: "Verify your email",
        html: await render(<VerifyEmailTemplate otp={otp} />),
      });

      return { success: true, data: null };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to send otp",
      };
    }
  }

  async sendPasswordResetEmail(
    to: string,
    url: string,
    username?: string,
  ): Promise<Result<null>> {
    try {
      await this.transporter.sendMail({
        from: this.from,
        to,
        subject: "Reset your password",
        html: await render(
          <ResetPasswordTemplate url={url} username={username} />,
        ),
      });

      return { success: true, data: null };
    } catch (err) {
      return {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Failed to send password reset email",
      };
    }
  }

  async sendNotificationEmail({
    to,
    recipientName,
    issuerName,
    actionText,
    actionUrl,
    subject,
  }: {
    to: string;
    recipientName?: string;
    issuerName: string;
    actionText: string;
    actionUrl: string;
    subject: string;
  }): Promise<Result<null>> {
    try {
      await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html: await render(
          <NotificationTemplate
            recipientName={recipientName}
            issuerName={issuerName}
            actionText={actionText}
            actionUrl={actionUrl}
          />,
        ),
      });

      return { success: true, data: null };
    } catch (err) {
      return {
        success: false,
        error:
          err instanceof Error ? err.message : "Failed to send notification",
      };
    }
  }
}

export const nodemailerUtils = new NodemailerUtils();
