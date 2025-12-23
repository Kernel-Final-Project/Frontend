import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { NormalizedBlogStatPoint } from "./types";

type Props = {
  data: NormalizedBlogStatPoint[];
};

export function AdminBlogStatsChart({ data }: Props) {
  return (
    <div className="rounded-lg border border-border bg-background/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">포스트 수 추이</p>
        <p className="text-xs text-muted-foreground">기간별 발행 포스트 수</p>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickFormatter={(v) => v.toLocaleString()} />
            <Tooltip formatter={(value: number) => value.toLocaleString()} contentStyle={{ borderRadius: 8, borderColor: "hsl(var(--border))" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="postCount" name="포스트 수" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
