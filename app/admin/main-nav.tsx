"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";
import { Badge } from "@/components/ui/badge";

const links = [
  {
    title: "Overview",
    href: "/admin/overview",
  },

  {
    title: "Products",
    href: "/admin/products",
  },
  {
    title: "Categories",
    href: "/admin/categories",
  },

  {
    title: "Orders",
    href: "/admin/orders",
  },

  {
    title: "Employees",
    href: "/admin/users",
  },
];

const MainNav = ({
  pendingOrdersCount = 0,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & { pendingOrdersCount?: number }) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname.includes(item.href) ? "" : "text-muted-foreground"
          )}
        >
          <span className="inline-flex items-center gap-2">
            {item.title}
            {item.href === "/admin/orders" && pendingOrdersCount > 0 && (
              <Badge variant="destructive" className="h-5 px-2">
                {pendingOrdersCount}
              </Badge>
            )}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
