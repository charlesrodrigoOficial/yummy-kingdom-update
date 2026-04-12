"use client";
import {
  BarChart,
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const Charts = ({
  data: { salesData },
}: {
  data: { salesData: { month: string; totalSales: number }[] };
}) => {
  const hasData = salesData.length > 0;

  const axisFormatter = (value: number) => {
    if (value >= 1000) return `${Math.round(value / 1000)}k`;
    return value.toString();
  };

  const currencyFormatter = (value: number) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(value);

  if (!hasData) {
    return (
      <div className="h-[320px] w-full rounded-xl border border-dashed flex items-center justify-center text-sm text-muted-foreground">
        No monthly sales data available yet.
      </div>
    );
  }

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={salesData} margin={{ left: 8, right: 16, top: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            width={50}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={axisFormatter}
          />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted))" }}
            formatter={(value) => currencyFormatter(Number(value))}
          />
          <Bar dataKey="totalSales" radius={[8, 8, 0, 0]} className="fill-primary" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;
