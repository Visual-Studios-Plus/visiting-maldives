"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const config = {
  views: { label: "Views", color: "var(--chart-1)" },
  saves: { label: "Saves", color: "var(--chart-2)" },
} satisfies ChartConfig;

const short = (day: string) => new Date(`${day}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/** Daily views (and saves, for guides) for the last 30 days. */
export default function ViewsChart({ data, showSaves = false }: { data: { day: string; views: number; saves: number }[]; showSaves?: boolean }) {
  const series = showSaves ? (["views", "saves"] as const) : (["views"] as const);
  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full">
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <defs>
          {series.map((k) => (
            <linearGradient key={k} id={`fill-${k}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={`var(--color-${k})`} stopOpacity={0.3} />
              <stop offset="95%" stopColor={`var(--color-${k})`} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} minTickGap={28} tickFormatter={short} />
        <YAxis width={36} tickLine={false} axisLine={false} allowDecimals={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(v) => short(String(v))} indicator="line" />} />
        {series.map((k) => (
          <Area key={k} dataKey={k} type="monotone" stroke={`var(--color-${k})`} strokeWidth={2} fill={`url(#fill-${k})`} />
        ))}
        {showSaves && <ChartLegend content={<ChartLegendContent />} />}
      </AreaChart>
    </ChartContainer>
  );
}
