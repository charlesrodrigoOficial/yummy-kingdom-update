import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActivePromotions } from "@/lib/actions/promotion.actions";

const HomeOffersGrid = async () => {
  const promotions = await getActivePromotions({
    placement: "HOME",
    limit: 3,
  });

  if (!promotions.length) {
    return null;
  }

  return (
    <section className="my-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Today&apos;s Offers</h2>
        <Button asChild variant="outline">
          <Link href="/offers">View all</Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {promotions.map((promotion) => (
          <Card key={promotion.id} className="h-full border-red-100/80">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Badge variant={promotion.type === "OFFER" ? "default" : "secondary"}>
                  {promotion.type}
                </Badge>
                <Badge variant="outline">{promotion.placement}</Badge>
              </div>
              <CardTitle className="text-xl">{promotion.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {promotion.subtitle && (
                <p className="text-sm font-medium text-muted-foreground">
                  {promotion.subtitle}
                </p>
              )}
              {promotion.description && (
                <p className="text-sm text-muted-foreground">{promotion.description}</p>
              )}
              <Button asChild size="sm">
                <Link href={promotion.ctaUrl || "/offers"}>
                  {promotion.ctaLabel || "See details"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HomeOffersGrid;
