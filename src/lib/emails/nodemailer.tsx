import { render } from "@react-email/render";
import { createTransport, type Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type { Result } from "../types";
import VerifyEmailTemplate from "./templates/verify-email";
import ResetPasswordTemplate from "./templates/reset-password";

export class NodemailerUtils {
  private readonly transporter: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_HOST!, 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(to: string, otp: string): Promise<Result<null>> {
    try {
      await this.transporter.sendMail({
        from: "Align Network <noreply@mail.align-network.xyz>",
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
        from: "Align Network <noreply@mail.align-network.xyz>",
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
}

export const nodemailerUtils = new NodemailerUtils();
