import Link from "next/link";
import { Megaphone, Tag } from "lucide-react";
import ProductCarousel from "@/components/shared/product/product-carousel";
import { getActivePromotions } from "@/lib/actions/promotion.actions";

const fallbackSlides = [
  {
    src: "/images/banner1.png",
    heading: "AN EASTER TREAT\nWORTH SHARING.",
    footnote: "T&C'S APPLY.",
    href: "/offers",
  },
  {
    src: "/images/banner2.png",
    heading: "HOT DEALS\nALL WEEKEND.",
    footnote: "LIMITED TIME.",
    href: "/offers",
  },
] as { src: string; heading: string; footnote?: string; href?: string }[];

const HomePromoBanner = async () => {
  const promotions = await getActivePromotions({ placement: "HOME", limit: 8 });

  const featured = promotions.find((item) => item.type === "OFFER") ?? promotions[0];
  const promoSlides = promotions
    .filter((item) => item.imageUrl)
    .map((item) => ({
      src: item.imageUrl as string,
      heading: item.title.toUpperCase(),
      footnote: item.subtitle || undefined,
      href: item.ctaUrl || "/offers",
    }));

  const slides = promoSlides.length > 0 ? promoSlides : fallbackSlides;
  const ctaHref = featured?.ctaUrl || "/offers";
  const ctaLabel = featured?.ctaLabel || "View All Offers";

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 overflow-hidden rounded-none md:grid-cols-[440px_minmax(0,1fr)] lg:grid-cols-[520px_minmax(0,1fr)]">
        <div className="bg-[#e31837] text-white px-8 py-10 md:px-12 md:py-14 relative">
          <div className="flex items-start gap-4">
            <div className="mt-1 hidden sm:block">
              <Tag className="h-14 w-14" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-wider font-bold">
                <Megaphone className="h-3.5 w-3.5" />
                Featured Offer
              </div>
              <h2 className="mt-5 whitespace-pre-line font-extrabold uppercase tracking-tight text-3xl leading-[0.95] md:text-4xl">
                {featured?.title || "Fresh Deals Every Week"}
              </h2>
              {featured?.subtitle && (
                <p className="mt-3 text-sm md:text-base font-semibold uppercase tracking-wide">
                  {featured.subtitle}
                </p>
              )}
              <p className="mt-5 text-sm md:text-base text-white/90 max-w-[34ch]">
                {featured?.description ||
                  "Browse the latest restaurant offers and brand advertisements in one place."}
              </p>
              <Link
                href={ctaHref}
                className="mt-7 inline-flex items-center rounded-md bg-white text-[#e31837] px-4 py-2 font-bold hover:bg-white/90 transition-colors"
              >
                {ctaLabel}
              </Link>
            </div>
          </div>
        </div>

        <ProductCarousel
          variant="hero"
          slides={slides}
          fullBleed={false}
          className="h-full"
          autoplayDelay={3500}
        />
      </div>
    </section>
  );
};

export default HomePromoBanner;
