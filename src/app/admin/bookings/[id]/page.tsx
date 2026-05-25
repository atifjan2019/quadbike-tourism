import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import BookingActions from "@/components/admin/BookingActions";
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

export default async function BookingDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { tour: true },
  });
  if (!booking) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/bookings" className="text-sm text-black/60 hover:underline">
            ← Back to bookings
          </Link>
          <h1 className="text-2xl font-extrabold mt-1">{booking.reference}</h1>
        </div>
        <Badge variant={STATUS_VARIANT[booking.status]}>{booking.status}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Tour" value={booking.tour.title} />
            <Row label="Date" value={format(booking.bookingDate, "EEEE, MMMM d, yyyy")} />
            <Row label="Time" value={booking.bookingTime} />
            <Row label="Guests" value={String(booking.guests)} />
            <Row label="Total" value={formatMoney(Number(booking.total))} />
            <Row label="Created" value={format(booking.createdAt, "yyyy-MM-dd HH:mm")} />
            {booking.notes && (
              <div>
                <div className="text-xs uppercase tracking-wider text-black/60 mb-1">Notes</div>
                <p className="bg-zinc-50 rounded p-3">{booking.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Name" value={booking.customerName} />
              <Row
                label="Email"
                value={
                  <a href={`mailto:${booking.customerEmail}`} className="underline">
                    {booking.customerEmail}
                  </a>
                }
              />
              <Row
                label="Phone"
                value={
                  <a href={`tel:${booking.customerPhone}`} className="underline">
                    {booking.customerPhone}
                  </a>
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingActions id={booking.id} currentStatus={booking.status} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-black/5 pb-2 last:border-0">
      <span className="text-xs uppercase tracking-wider text-black/60">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
