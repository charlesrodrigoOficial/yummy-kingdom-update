import {
  APP_NAME,
  SHOP_CONTACT,
  SHOP_EMAIL,
  SHOP_FACEBOOK,
  SHOP_WHATSAPP,
} from "@/lib/constants";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="wrapper py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/about-us" className="hover:underline">
            About Us
          </Link>
          <Link href="/contact-us" className="hover:underline">
            Contact Us
          </Link>
          <Link
            href={`https://wa.me/94${SHOP_WHATSAPP.replace(/\s+/g, "").slice(1)}`}
            target="_blank"
            className="hover:underline"
          >
            WhatsApp
          </Link>
          <Link href={SHOP_FACEBOOK} target="_blank" className="hover:underline">
            Facebook
          </Link>
        </div>
        <div className="text-sm text-muted-foreground text-right">
          <div>{currentYear} {APP_NAME}. All Rights Reserved</div>
          <div>{SHOP_CONTACT} | {SHOP_EMAIL}</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
