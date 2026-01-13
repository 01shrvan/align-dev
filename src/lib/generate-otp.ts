import { randomInt } from "node:crypto";

export function generateSecureOTP(length = 6): string {
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += randomInt(0, 10).toString();
  }

  return otp;
}
