import Image from "next/image";
import Link from "next/link";
import { Pizza } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import CategoryDrawer from "./category-drawer";
import Menu from "./menu";
import Search from "./search";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="wrapper flex items-center gap-3">
        <div className="ml-3 flex shrink-0 items-center">
          <CategoryDrawer />
          <Link href="/" className="flex-start ml-4 gap-2">
          <Image
            src="/images/logo.svg"
            alt={`${APP_NAME} logo`}
            height={52}
            width={52}
            priority
            className="animate-float-slow rounded-lg"
          />
            <div className="hidden lg:block">
              <span className="ml-1 inline-flex items-center gap-2 whitespace-nowrap text-xl font-bold">
                <Pizza className="h-5 w-5 text-orange-500" />
                <span className="text-gradient-pizza">{APP_NAME}</span>
              </span>
            </div>
          </Link>
        </div>

        <div className="hidden flex-1 min-w-0 items-center justify-end gap-2 md:flex xl:justify-center xl:gap-3">
          <div className="hidden xl:block">
            <Search />
          </div>
          <Menu />
        </div>

        <div className="ml-auto md:hidden">
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
