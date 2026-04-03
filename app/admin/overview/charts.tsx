"use client";
import { BarChart, ResponsiveContainer, Bar, XAxis, YAxis } from "recharts";

const Charts = ({
  data: { salesData },
}: {
  data: { salesData: { month: string; totalSales: number }[] };
}) => {
  return (
    < div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
      <BarChart data={salesData}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `Rs.${value}`}
        />
        <Bar
          dataKey="totalSales"
          fill="currentColor"
          radius={[40, 40, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
};

export default Charts;
