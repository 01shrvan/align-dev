import SearchField from "@/components/SearchField.tsx";
import UserButton from "@/components/UserButton";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border/50 shadow-sm">
      <div className="block sm:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/home"
            className="flex font-thunder items-center gap-2 text-3xl font-logo text-primary tracking-widest"
          >
            <Image src={logo} alt="Align Network Logo" className="h-8 w-8" />
            Align Network
          </Link>
          <UserButton />
        </div>
        <div className="px-4 pb-3">
          <SearchField />
        </div>
      </div>

      <div className="hidden sm:block">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
          <Link
            href="/home"
            className="flex items-center gap-2 text-3xl font-logo font-thunder text-primary tracking-widest"
          >
            <Image src={logo} alt="Align Network Logo" className="h-8 w-8" />
            Align Network
          </Link>
          <SearchField />
          <UserButton className="sm:ms-auto" />
        </div>
      </div>
    </header>
  );
}
