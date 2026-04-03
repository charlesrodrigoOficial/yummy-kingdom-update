import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth-guard";
import CategoryManager from "@/components/admin/category-manager";
import { getAllPizzaCategories } from "@/lib/actions/category.actions";

export const metadata: Metadata = {
  title: "Pizza Categories",
};

const AdminCategoriesPage = async () => {
  await requireAdmin();
  const categories = await getAllPizzaCategories();

  return (
    <div className="space-y-4">
      <h1 className="h2-bold">Pizza Categories</h1>
      <p className="text-muted-foreground">
        Manage menu categories used by Yummy Kingdom products.
      </p>
      <CategoryManager initialCategories={categories} />
    </div>
  );
};

export default AdminCategoriesPage;
