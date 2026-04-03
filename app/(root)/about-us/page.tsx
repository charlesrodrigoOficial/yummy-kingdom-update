import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SHOP_ADDRESS,
  SHOP_TAGLINE,
  SHOP_WHATSAPP,
  SHOP_FACEBOOK,
} from "@/lib/constants";
import { Pizza, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
};

const AboutUsPage = () => {
  const highlights = [
    {
      title: "Authentic Italian Flavor",
      description:
        "Our kitchen team prepares each pizza with rich sauces, quality cheese, and carefully selected toppings.",
      icon: Pizza,
    },
    {
      title: "Consistent Quality",
      description:
        "From dough to delivery, every order is handled with strict quality checks and fast kitchen coordination.",
      icon: ShieldCheck,
    },
    {
      title: "Fast Ordering Experience",
      description:
        "Online ordering is designed to be simple so customers can place their meal quickly from mobile or desktop.",
      icon: Sparkles,
    },
  ];

  return (
    <section className="py-10 md:py-14 space-y-8 md:space-y-10">
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-emerald-50/80 via-background to-background p-6 md:p-10">
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="relative max-w-3xl space-y-4">
          <Badge variant="secondary" className="px-3 py-1">
            About {APP_NAME}
          </Badge>
          <h1 className="h1-bold">Hidden secrets of pizza in every slice.</h1>
          <p className="text-muted-foreground leading-7">
            {SHOP_TAGLINE}
          </p>
          <p className="text-sm">{SHOP_ADDRESS}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
              <Link href="/search">Explore Menu</Link>
            </Button>
            <Button asChild variant="outline">
              <Link
                href={`https://wa.me/94${SHOP_WHATSAPP.replace(/\s+/g, "").slice(1)}`}
                target="_blank"
              >
                WhatsApp Order
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={SHOP_FACEBOOK} target="_blank">
                Follow Facebook
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="rounded-2xl border p-5">
            <item.icon className="h-5 w-5 text-emerald-700" />
            <h2 className="mt-3 text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border p-6 md:p-8">
        <h2 className="h3-bold">What We Stand For</h2>
        <p className="mt-3 text-muted-foreground leading-7">
          Yummy Kingdom is proudly based in Ja-Ela and focused on serving
          delicious Italian meals with a reliable local delivery experience.
        </p>
      </div>
    </section>
  );
};

export default AboutUsPage;
