import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SHOP_ADDRESS,
  SHOP_CONTACT,
  SHOP_EMAIL,
  SHOP_FACEBOOK,
  SHOP_GOOGLE_MAPS_URL,
  SHOP_MAP_EMBED_URL,
  SHOP_TAGLINE,
  SHOP_WHATSAPP,
} from "@/lib/constants";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
};

const ContactUsPage = () => {
  const contactDetails = [
    {
      title: "Email Support",
      value: SHOP_EMAIL,
      href: `mailto:${SHOP_EMAIL}`,
      icon: Mail,
    },
    {
      title: "Call Us",
      value: SHOP_CONTACT,
      href: `tel:+94${SHOP_CONTACT.replace(/\s+/g, "").slice(1)}`,
      icon: Phone,
    },
    {
      title: "Business Hours",
      value: "Monday to Sunday, 11:00 AM to 11:00 PM",
      icon: Clock3,
    },
    {
      title: "Location",
      value: SHOP_ADDRESS,
      href: SHOP_GOOGLE_MAPS_URL,
      icon: MapPin,
    },
  ];

  return (
    <section className="py-10 md:py-14 space-y-8 md:space-y-10">
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-amber-50/80 via-background to-background p-6 md:p-10">
        <div className="absolute -left-16 -bottom-20 h-52 w-52 rounded-full bg-amber-200/50 blur-3xl" />
        <div className="relative max-w-3xl space-y-4">
          <Badge variant="secondary" className="px-3 py-1">
            Contact {APP_NAME}
          </Badge>
          <h1 className="h1-bold">We are here to help with your order.</h1>
          <p className="text-muted-foreground leading-7">
            {SHOP_TAGLINE}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
              <Link href={`mailto:${SHOP_EMAIL}`}>Email Support</Link>
            </Button>
            <Button asChild variant="outline">
              <Link
                href={`https://wa.me/94${SHOP_WHATSAPP.replace(/\s+/g, "").slice(1)}`}
                target="_blank"
              >
                WhatsApp
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={SHOP_FACEBOOK} target="_blank">
                Facebook
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {contactDetails.map((item) => (
          <article key={item.title} className="rounded-2xl border p-5">
            <item.icon className="h-5 w-5 text-amber-700" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              {item.title}
            </p>
            {item.href ? (
              <Link href={item.href} className="mt-1 block font-semibold hover:underline">
                {item.value}
              </Link>
            ) : (
              <p className="mt-1 font-semibold">{item.value}</p>
            )}
          </article>
        ))}
      </div>

      <div className="rounded-2xl border p-3 md:p-5">
        <h2 className="h3-bold px-3 pt-3">Find Us on Google Maps</h2>
        <p className="px-3 py-2 text-sm text-muted-foreground">
          Delivery starts from our Ja-Ela kitchen. Tap directions to navigate.
        </p>
        <div className="overflow-hidden rounded-xl border">
          <iframe
            title="Yummy Kingdom Location"
            src={SHOP_MAP_EMBED_URL}
            className="w-full h-[320px] md:h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="p-3">
          <Button asChild variant="outline">
            <Link href={SHOP_GOOGLE_MAPS_URL} target="_blank">
              Open in Google Maps
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContactUsPage;
