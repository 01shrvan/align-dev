import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <h1>hello fam</h1>
      <Link
        href="/login"
        className="inline-block px-6 py-2 border border-gray-600 rounded-full text-blue-400 hover:bg-gray-900 transition-colors font-medium text-sm"
      >
        Login
      </Link>
    </div>
  );
}
