import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { formatMoney } from "@/lib/utils";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ToursPage() {
  const tours = await prisma.tour.findMany({
    include: { category: true, _count: { select: { bookings: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Tours</h1>
          <p className="text-black/60 text-sm">{tours.length} tour{tours.length === 1 ? "" : "s"}</p>
        </div>
        <Button href="/admin/tours/new">
          <Plus className="w-4 h-4" />
          NEW TOUR
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <THead>
              <TR>
                <TH>Title</TH>
                <TH>Category</TH>
                <TH>Price</TH>
                <TH>Bookings</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {tours.length === 0 ? (
                <TR>
                  <TD className="py-10 text-center text-black/50" colSpan={6}>
                    No tours yet. Create your first one.
                  </TD>
                </TR>
              ) : (
                tours.map((t) => (
                  <TR key={t.id}>
                    <TD>
                      <Link href={`/admin/tours/${t.id}`} className="font-bold hover:underline">
                        {t.title}
                      </Link>
                      <div className="text-xs text-black/50">/{t.slug}</div>
                    </TD>
                    <TD>{t.category.name}</TD>
                    <TD>{formatMoney(Number(t.priceFrom))}</TD>
                    <TD>{t._count.bookings}</TD>
                    <TD>
                      <Badge variant={t.status === "PUBLISHED" ? "success" : "muted"}>
                        {t.status}
                      </Badge>
                    </TD>
                    <TD className="text-right">
                      <Link
                        href={`/admin/tours/${t.id}`}
                        className="text-sm font-bold hover:underline"
                      >
                        Edit
                      </Link>
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
