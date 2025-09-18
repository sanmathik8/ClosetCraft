import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          My Clothing Store
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-2 relative">
              <button
                onClick={() => router.push("/profile")}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zm0-2a4 4 0 110-8 4 4 0 010 8z" />
                </svg>
                <span className="font-semibold text-gray-700 text-sm">
                  {session.user.email}
                </span>
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="ml-2 text-sm text-red-500 hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/auth"
                className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
