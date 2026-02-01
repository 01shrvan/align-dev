import logo from "@/assets/logo.svg";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function Page() {
  return (
    <div className="h-screen text-white flex overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="w-80 h-80">
          <Image
            src={logo || "/placeholder.svg"}
            alt="Forgot Password"
            className="w-full h-full object-contain"
            priority
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-8">
        <div className="max-w-md">
          <div className="lg:hidden mb-6 w-12 h-12">
            <Image
              src={logo || "/placeholder.svg"}
              alt="Forgot Password"
              className="w-full h-full object-contain"
              priority
            />
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold">
                Recover your<br />password
              </h1>
              <p className="text-gray-400">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            <div className="space-y-4">
              <ForgotPasswordForm />
            </div>

            <div className="space-y-3">
              <Link
                href="/login"
                className="inline-block text-blue-400 hover:underline transition-colors font-medium text-sm"
              >
                &larr; Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
