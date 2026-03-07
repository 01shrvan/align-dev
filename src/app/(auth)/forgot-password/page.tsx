import logo from "@/assets/logo.svg";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { MeshGradient } from "@paper-design/shaders-react";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground flex">
      <div className="hidden lg:block w-1/2 relative h-screen border-r border-border/50">
        <MeshGradient
          className="absolute inset-0 w-full h-full"
          colors={["#121212", "#dddbcb", "#83e665", "#c1ff70"]}
          distortion={0.53}
          swirl={0.23}
          grainMixer={0.0}
          grainOverlay={0.33}
          speed={0.2}
        />
        <div className="absolute inset-0 flex flex-col justify-between p-12 pointer-events-none z-10">
          <div className="space-y-6">
            <Image src={logo} alt="Align" className="h-14 w-14" priority />
            <div className="space-y-4">
              {/* <p className="text-xs uppercase tracking-[0.28em] text-foreground/80 drop-shadow-md">
                Recover Account
              </p> */}
              <h1 className="font-serif text-6xl leading-[1.05] text-[#dddbcb] drop-shadow-sm">
                Forgot your
                <br />
                password?
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-16 py-8 relative">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Image src={logo} alt="Align" className="h-10 w-10" priority />
            <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Align
            </span>
          </div>

          <div className="space-y-7">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Recovery
              </p>
              <h2 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">
                Reset password
              </h2>
              {/* <p className="text-sm text-muted-foreground">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p> */}
            </div>

            <ForgotPasswordForm />

            <Link
              href="/login"
              className="inline-block text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              &larr; Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
