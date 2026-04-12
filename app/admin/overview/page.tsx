import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOrderSummary } from "@/lib/actions/order.actions";
import { formatCurreny, formatDateTime, formatNumber } from "@/lib/utils";
import {
  BadgeDollarSign,
  Barcode,
  CreditCard,
  Truck,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import Charts from "./charts";
import { requireAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const AdminOverviewPage = async () => {
  await requireAdmin();

  const summary = await getOrderSummary();
  const totalRevenue = summary.totalSales._sum.totalPrice?.toString() || "0";

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurreny(totalRevenue),
      helper: "Lifetime sales value",
      icon: BadgeDollarSign,
      iconClassName: "text-emerald-600",
    },
    {
      title: "Sales",
      value: formatNumber(summary.ordersCount),
      helper: "Total completed + pending orders",
      icon: CreditCard,
      iconClassName: "text-blue-600",
    },
    {
      title: "Customers",
      value: formatNumber(summary.usersCount),
      helper: "Registered customer accounts",
      icon: Users,
      iconClassName: "text-violet-600",
    },
    {
      title: "Products",
      value: formatNumber(summary.productsCount),
      helper: "Live menu products",
      icon: Barcode,
      iconClassName: "text-amber-600",
    },
    {
      title: "Pending Orders",
      value: formatNumber(summary.pendingOrdersCount),
      helper: "Need preparation or delivery",
      icon: Truck,
      iconClassName: "text-rose-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track restaurant performance, sales flow, and recent customer orders.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            Updated {formatDateTime(new Date()).dateTime}
          </Badge>
          <Button asChild size="sm">
            <Link href="/admin/orders" className="inline-flex items-center gap-1.5">
              View Orders
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((item) => (
          <Card key={item.title} className="shadow-sm border-border/70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <item.icon className={`h-5 w-5 ${item.iconClassName}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{item.helper}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 shadow-sm border-border/70">
          <CardHeader>
            <CardTitle>Monthly Sales Trend</CardTitle>
            <CardDescription>
              Revenue movement based on order totals per month.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Charts
              data={{
                salesData: summary.salesData,
              }}
            />
          </CardContent>
        </Card>

        <Card className="xl:col-span-1 shadow-sm border-border/70">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest transactions across all orders.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.latestSales.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No recent sales yet.
                    </TableCell>
                  </TableRow>
                )}
                {summary.latestSales.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">
                        {order?.user?.name ? order.user.name : "Deleted User"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDateTime(order.createdAt).dateOnly}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurreny(order.totalPrice)}</TableCell>
                    <TableCell>
                      <Badge variant={order.isPaid ? "default" : "secondary"}>
                        {order.isPaid ? "Paid" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/order/${order.id}`}>Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
