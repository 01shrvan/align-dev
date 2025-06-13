import logo from "@/assets/logo.svg"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import LoginForm from "./LoginForm"

export const metadata: Metadata = {
  title: "Login to Align",
}

export default function Page() {
  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="w-80 h-80">
          <Image src={logo || "/placeholder.svg"} alt="Login" className="w-full h-full object-contain" priority />
        </div>
      </div>

      {/* Right side - Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-8">
        <div className="max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-6 w-12 h-12">
            <Image
              src={logo || "/placeholder.svg"}
              alt="Login"
              className="w-full h-full object-contain"
              priority
            />
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold">Welcome back</h1>
              <h2 className="text-2xl font-normal">Login today.</h2>
            </div>

            {/* Login Form */}
            <div className="space-y-4">
              <LoginForm />
            </div>

            <div className="space-y-3">
              <p className="text-base font-medium">Don&apos;t have an account?</p>
              <Link
                href="/signup"
                className="inline-block px-6 py-2 border border-gray-600 rounded-full text-blue-400 hover:bg-gray-900 transition-colors font-medium text-sm"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
