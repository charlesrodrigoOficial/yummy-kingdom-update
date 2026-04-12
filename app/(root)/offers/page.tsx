import Link from "next/link";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getActivePromotions } from "@/lib/actions/promotion.actions";

export const metadata: Metadata = {
  title: "Offers",
};

const OffersPage = async () => {
  const promotions = await getActivePromotions({
    placement: "OFFERS",
    limit: 100,
  });

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight">Offers and Ads</h1>
        <p className="text-muted-foreground">
          Explore the latest promotions published by our admin team.
        </p>
      </div>

      {promotions.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-muted-foreground">
            No active offers right now. Please check back soon.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promotion) => (
            <Card key={promotion.id} className="overflow-hidden flex flex-col">
              {promotion.imageUrl && (
                <div className="aspect-[16/9] w-full bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={promotion.imageUrl}
                    alt={promotion.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant={promotion.type === "OFFER" ? "default" : "secondary"}>
                    {promotion.type}
                  </Badge>
                  <Badge variant="outline">{promotion.placement}</Badge>
                </div>
                <CardTitle className="text-xl">{promotion.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground flex-1">
                {promotion.subtitle && <p className="font-medium">{promotion.subtitle}</p>}
                {promotion.description && <p>{promotion.description}</p>}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={promotion.ctaUrl || "/search"}>
                    {promotion.ctaLabel || "Grab this offer"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OffersPage;
