import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#e31837] text-white">
      <div className="mx-auto grid h-14 max-w-7xl grid-cols-3 items-center px-5 md:px-10">
        <div />
        <Link href="/" className="justify-self-center flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt={`${APP_NAME} logo`}
            height={40}
            width={40}
            priority
            className="brightness-0 invert"
          />
        </Link>
        <div className="justify-self-end">
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
