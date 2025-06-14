import SearchField from "@/components/SearchField.tsx";
import UserButton from "@/components/UserButton";
import Image from "next/image";
import logo from "@/assets/logo.svg"
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Image src={logo} alt="Align Network Logo" className="h-8 w-8" />
          Align Network
        </Link>
        <SearchField />
        <UserButton className="sm:ms-auto" />
      </div>
    </header>
  );
}