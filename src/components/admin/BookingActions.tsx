"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, XCircle, Flag, Trash2 } from "lucide-react";

type Status = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export default function BookingActions({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: Status;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(status: Status) {
    setBusy(true);
    try {
      await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function destroy() {
    if (!confirm("Delete this booking permanently?")) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
      router.push("/admin/bookings");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      {currentStatus !== "CONFIRMED" && (
        <Button
          variant="default"
          className="w-full"
          disabled={busy}
          onClick={() => setStatus("CONFIRMED")}
        >
          <CheckCircle2 className="w-4 h-4" />
          Confirm + Email Customer
        </Button>
      )}
      {currentStatus !== "COMPLETED" && (
        <Button
          variant="secondary"
          className="w-full"
          disabled={busy}
          onClick={() => setStatus("COMPLETED")}
        >
          <Flag className="w-4 h-4" />
          Mark Completed
        </Button>
      )}
      {currentStatus !== "CANCELLED" && (
        <Button
          variant="outline"
          className="w-full"
          disabled={busy}
          onClick={() => setStatus("CANCELLED")}
        >
          <XCircle className="w-4 h-4" />
          Cancel Booking
        </Button>
      )}
      <Button
        variant="destructive"
        className="w-full"
        disabled={busy}
        onClick={destroy}
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </Button>
    </div>
  );
}
