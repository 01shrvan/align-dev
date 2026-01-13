import type { Metadata } from "next";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import VerifyEmailForm from "./VerifyEmailForm";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default function Page() {
  return (
    <div className="h-screen text-white flex overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="w-80 h-80">
          <Image
            src={logo || "/placeholder.svg"}
            alt="Align Logo"
            className="w-full h-full"
            priority
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-8">
        <div className="max-w-md">
          <div className="lg:hidden mb-6 w-12 h-12">
            <Image
              src={logo || "/placeholder.svg"}
              alt="Align Logo"
              className="w-full h-full"
              priority
            />
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight leading-none">
                Verify your email
              </h1>
              <h2 className="text-xl font-light text-gray-200 tracking-wide">
                Please enter the code sent to your inbox.
              </h2>
            </div>

            <div className="space-y-4">
              <VerifyEmailForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
