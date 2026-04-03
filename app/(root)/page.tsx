import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProductButton from "@/components/view-all-products-button";
import {
  getFeaturedProducts,
  getLatestProduct,
} from "@/lib/actions/product.actions";
import {
  SHOP_ADDRESS,
  SHOP_CONTACT,
  SHOP_TAGLINE,
  SHOP_WHATSAPP,
} from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Homepage = async () => {
  const latestProducts = await getLatestProduct();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <section className="py-8 md:py-10">
        <div className="rounded-3xl border p-6 md:p-10 bg-gradient-to-br from-amber-50 via-white to-red-50">
          <Badge variant="secondary">Yummy Kingdom - Ja-Ela</Badge>
          <h1 className="h1-bold mt-4">Fresh Pizza. Fast Delivery.</h1>
          <p className="mt-4 text-muted-foreground max-w-3xl">{SHOP_TAGLINE}</p>
          <p className="mt-4 text-sm">{SHOP_ADDRESS}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`tel:+94${SHOP_CONTACT.replace(/\s+/g, "").slice(1)}`}>
                Call {SHOP_CONTACT}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link
                href={`https://wa.me/94${SHOP_WHATSAPP.replace(/\s+/g, "").slice(1)}`}
                target="_blank"
              >
                Order via WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </section>
      {featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}
      <ProductList data={latestProducts} title="Popular Pizza Picks" />
      <ViewAllProductButton />
    </>
  );
};

export default Homepage;
