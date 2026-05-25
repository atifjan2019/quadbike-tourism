import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_VARIANT: Record<string, "warning" | "success" | "muted" | "destructive"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  COMPLETED: "muted",
  CANCELLED: "destructive",
};

export default async function DashboardPage() {
  const [tourCount, bookingCount, pendingCount, recentBookings, recentRevenue] =
    await Promise.all([
      prisma.tour.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { tour: { select: { title: true } } },
      }),
      prisma.booking.aggregate({
        _sum: { total: true },
        where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
      }),
    ]);

  const stats = [
    { label: "Total Tours", value: tourCount },
    { label: "Total Bookings", value: bookingCount },
    { label: "Pending", value: pendingCount },
    {
      label: "Revenue (confirmed)",
      value: formatMoney(Number(recentRevenue._sum.total ?? 0)),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Dashboard</h1>
        <p className="text-black/60 text-sm">Overview of bookings, tours and revenue.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent>
              <div className="text-xs uppercase tracking-wider text-black/60">{s.label}</div>
              <div className="mt-1 text-2xl font-extrabold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Recent Bookings</CardTitle>
          <Link href="/admin/bookings" className="text-sm font-bold text-black/70 hover:text-black">
            View all →
          </Link>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-sm text-black/60">No bookings yet.</p>
          ) : (
            <ul className="divide-y divide-black/10">
              {recentBookings.map((b) => (
                <li key={b.id} className="flex items-center justify-between py-3 gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="font-bold text-black hover:underline truncate block"
                    >
                      {b.reference}
                    </Link>
                    <p className="text-xs text-black/60 truncate">
                      {b.customerName} · {b.tour.title} · {b.guests} guest
                      {b.guests > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold">{formatMoney(Number(b.total))}</span>
                    <Badge variant={STATUS_VARIANT[b.status]}>{b.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
