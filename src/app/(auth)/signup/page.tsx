import type { Metadata } from "next"
import Image from "next/image"
import logo from "@/assets/logo.svg"
import Link from "next/link"
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Join Align",
}

export default function Page() {
  return (
    <div className="h-screen text-white flex overflow-hidden font-sans">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="w-80 h-80">
          <Image src={logo || "/placeholder.svg"} alt="Align Logo" className="w-full h-full" priority />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-8">
        <div className="max-w-md">
          <div className="lg:hidden mb-6 w-12 h-12">
            <Image src={logo || "/placeholder.svg"} alt="Align Logo" className="w-full h-full" priority />
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-semibold tracking-tight leading-none font-sans">
                Thoughts connecting
              </h1>
              <h2 className="text-2xl font-light text-gray-200 tracking-wide font-sans">
                Join today.
              </h2>
            </div>

            <div className="space-y-4">
              <SignUpForm />
            </div>

            <div className="space-y-3">
              <p className="text-base font-medium text-gray-300 font-sans">
                Already have an account?
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-2.5 border border-gray-600 rounded-full text-blue-400 hover:bg-gray-900 hover:border-gray-500 transition-all duration-200 font-medium text-sm tracking-wide font-sans"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}