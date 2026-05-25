import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { formatMoney } from "@/lib/utils";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

const STATUS_VARIANT: Record<string, "warning" | "success" | "muted" | "destructive"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  COMPLETED: "muted",
  CANCELLED: "destructive",
};

export default async function BookingsPage(props: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const search = await props.searchParams;
  const bookings = await prisma.booking.findMany({
    where: {
      ...(search.status
        ? { status: search.status as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" }
        : {}),
      ...(search.q
        ? {
            OR: [
              { reference: { contains: search.q, mode: "insensitive" } },
              { customerName: { contains: search.q, mode: "insensitive" } },
              { customerEmail: { contains: search.q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { tour: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  const statuses = ["", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Bookings</h1>
        <p className="text-black/60 text-sm">{bookings.length} booking{bookings.length === 1 ? "" : "s"}</p>
      </div>

      <form className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col">
          <label className="text-xs font-bold uppercase tracking-wider text-black/70 mb-1">Search</label>
          <input
            name="q"
            defaultValue={search.q ?? ""}
            placeholder="Reference, name, or email…"
            className="h-10 px-3 rounded-md border border-black/20 bg-white text-sm w-72"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-bold uppercase tracking-wider text-black/70 mb-1">Status</label>
          <select
            name="status"
            defaultValue={search.status ?? ""}
            className="h-10 px-3 rounded-md border border-black/20 bg-white text-sm"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s || "Any"}
              </option>
            ))}
          </select>
        </div>
        <button className="h-10 px-4 rounded-md bg-black text-white text-sm font-bold uppercase tracking-wider">
          Filter
        </button>
      </form>

      <Card>
        <CardContent className="p-0">
          <Table>
            <THead>
              <TR>
                <TH>Reference</TH>
                <TH>Customer</TH>
                <TH>Tour</TH>
                <TH>Date / Time</TH>
                <TH>Guests</TH>
                <TH>Total</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {bookings.length === 0 ? (
                <TR>
                  <TD className="py-10 text-center text-black/50" colSpan={7}>
                    No bookings match these filters.
                  </TD>
                </TR>
              ) : (
                bookings.map((b) => (
                  <TR key={b.id}>
                    <TD>
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="font-bold hover:underline"
                      >
                        {b.reference}
                      </Link>
                    </TD>
                    <TD>
                      <div className="font-medium">{b.customerName}</div>
                      <div className="text-xs text-black/60">{b.customerEmail}</div>
                    </TD>
                    <TD>{b.tour.title}</TD>
                    <TD>
                      {format(b.bookingDate, "yyyy-MM-dd")}
                      <div className="text-xs text-black/60">{b.bookingTime}</div>
                    </TD>
                    <TD>{b.guests}</TD>
                    <TD>{formatMoney(Number(b.total))}</TD>
                    <TD>
                      <Badge variant={STATUS_VARIANT[b.status]}>{b.status}</Badge>
                    </TD>
                  </TR>
                ))
              )}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
