"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Card, CardContent } from "@/components/ui/Card";
import { Trash2, Plus, Save } from "lucide-react";

type Item = {
  id: string;
  name: string;
  country: string | null;
  message: string;
  rating: number;
  avatar: string | null;
  order: number;
};

export default function TestimonialsManager({ initial }: { initial: Item[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [avatar, setAvatar] = useState("");

  async function create() {
    if (!name || !message) return;
    await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        country: country || null,
        message,
        rating,
        avatar: avatar || null,
        order: initial.length,
      }),
    });
    setName("");
    setCountry("");
    setMessage("");
    setAvatar("");
    setRating(5);
    router.refresh();
  }

  async function update(id: string, patch: Partial<Item>) {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    router.refresh();
  }

  async function destroy(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-3">
          <h2 className="font-bold text-lg">Add Testimonial</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Country</Label>
              <Input value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Rating (1–5)</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value || "5"))}
              />
            </div>
            <div className="space-y-1">
              <Label>Avatar URL</Label>
              <Input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="/uploads/…" />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Message</Label>
            <Textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <Button onClick={create}>
            <Plus className="w-4 h-4" /> ADD
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {initial.map((t) => (
          <ItemCard
            key={t.id}
            item={t}
            onSave={(patch) => update(t.id, patch)}
            onDelete={() => destroy(t.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ItemCard({
  item,
  onSave,
  onDelete,
}: {
  item: Item;
  onSave: (patch: Partial<Item>) => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState<Item>(item);

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Country</Label>
            <Input
              value={draft.country ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, country: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Rating</Label>
            <Input
              type="number"
              min={1}
              max={5}
              value={draft.rating}
              onChange={(e) =>
                setDraft((d) => ({ ...d, rating: parseInt(e.target.value || "5") }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label>Order</Label>
            <Input
              type="number"
              value={draft.order}
              onChange={(e) =>
                setDraft((d) => ({ ...d, order: parseInt(e.target.value || "0") }))
              }
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label>Avatar URL</Label>
          <Input
            value={draft.avatar ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, avatar: e.target.value }))}
          />
        </div>
        <div className="space-y-1">
          <Label>Message</Label>
          <Textarea
            rows={4}
            value={draft.message}
            onChange={(e) => setDraft((d) => ({ ...d, message: e.target.value }))}
          />
        </div>
        <div className="flex justify-between">
          <Button onClick={() => onSave(draft)}>
            <Save className="w-4 h-4" /> Save
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
