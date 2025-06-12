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
        <div className="h-screen bg-black text-white flex overflow-hidden">
            {/* Left side - Logo */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
                <div className="w-80 h-80">
                    <Image src={logo || "/placeholder.svg"} alt="Align Logo" className="w-full h-full" priority />
                </div>
            </div>

            {/* Right side - Content */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-8">
                <div className="max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden mb-6 w-12 h-12">
                        <Image src={logo || "/placeholder.svg"} alt="Align Logo" className="w-full h-full" priority />
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-5xl lg:text-6xl font-bold">Thoughts connecting</h1>
                            <h2 className="text-2xl font-normal">Join today.</h2>
                        </div>

                        {/* Form placeholder - reduced height */}
                        <div className="space-y-4">
                            <div className="h-32 border border-gray-800 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500 text-sm">
                                    <SignUpForm />
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-base font-medium">Already have an account?</p>
                            <Link
                                href="/login"
                                className="inline-block px-6 py-2 border border-gray-600 rounded-full text-blue-400 hover:bg-gray-900 transition-colors font-medium text-sm"
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Visible X link */}
                <div className="absolute bottom-6 left-6">
                    <Link href="https://x.com/yourusername" className="text-white hover:text-gray-300 text-xl font-bold">
                        𝕏
                    </Link>
                </div>
            </div>
        </div>
    )
}
