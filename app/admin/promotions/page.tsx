import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth-guard";
import PromotionManager from "@/components/admin/promotion-manager";
import { getAllPromotionsForAdmin } from "@/lib/actions/promotion.actions";

export const metadata: Metadata = {
  title: "Promotions",
};

const AdminPromotionsPage = async () => {
  await requireAdmin();
  const promotions = await getAllPromotionsForAdmin();

  return (
    <div className="space-y-4">
      <h1 className="h2-bold">Offers and Advertisements</h1>
      <p className="text-muted-foreground">
        Create and schedule campaigns shown on the home banner and Offers page.
      </p>
      <PromotionManager initialPromotions={promotions} />
    </div>
  );
};

export default AdminPromotionsPage;
