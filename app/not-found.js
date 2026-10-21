import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050706] text-white flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-extrabold mb-2">Page Not Found</h2>
      <p className="text-zinc-400 mb-6">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all"
      >
        Return to Home
      </Link>
    </div>
  );
}
