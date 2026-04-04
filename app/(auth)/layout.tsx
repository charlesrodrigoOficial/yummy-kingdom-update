import Image from "next/image";
import Link from "next/link";
import { APP_NAME, AUTH_SIDE_IMAGE, AUTH_SIDE_IMAGE_ALT } from "@/lib/constants";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <aside className="relative hidden lg:block">
          <Image
            src={AUTH_SIDE_IMAGE}
            alt={AUTH_SIDE_IMAGE_ALT}
            fill
            priority
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute left-10 top-10">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-none bg-white/90 px-4 py-2 text-sm font-semibold text-black backdrop-blur"
            >
              <span className="text-[#e31837] font-black">{APP_NAME}</span>
            </Link>
          </div>
        </aside>

        <main className="flex min-h-screen items-center justify-center px-5 py-10 md:px-10">
          <div className="w-full max-w-xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
