"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Input } from "../ui/input";

const AdminSearch = () => {
  const pathname = usePathname();
  const routeConfig = useMemo(() => {
    if (pathname.includes("/admin/orders")) {
      return { action: "/admin/orders", placeholder: "Search orders..." };
    }
    if (pathname.includes("/admin/users")) {
      return { action: "/admin/users", placeholder: "Search employees..." };
    }
    if (pathname.includes("/admin/products")) {
      return { action: "/admin/products", placeholder: "Search products..." };
    }
    return null;
  }, [pathname]);

  const searchParams = useSearchParams();
  const [queryValue, setQueryValue] = useState(searchParams.get("query") || "");

  useEffect(() => {
    setQueryValue(searchParams.get("query") || "");
  }, [searchParams]);

  if (!routeConfig) {
    return null;
  }

  return (
    <form action={routeConfig.action} method="GET">
      <Input
        type="search"
        placeholder={routeConfig.placeholder}
        name="query"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        className="w-[220px] xl:w-[280px]"
      />
      <button className="sr-only" type="submit">
        Search
      </button>
    </form>
  );
};

export default AdminSearch;
