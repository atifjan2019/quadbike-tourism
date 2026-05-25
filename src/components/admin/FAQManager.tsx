"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Card, CardContent } from "@/components/ui/Card";
import { Trash2, Plus, ArrowUp, ArrowDown, Save } from "lucide-react";

type Item = { id: string; question: string; answer: string; order: number };

export default function FAQManager({ initial }: { initial: Item[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  async function create() {
    if (!q || !a) return;
    await fetch("/api/admin/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q.toUpperCase(), answer: a, order: initial.length }),
    });
    setQ("");
    setA("");
    router.refresh();
  }

  async function update(id: string, patch: Partial<Item>) {
    await fetch(`/api/admin/faq/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    router.refresh();
  }

  async function destroy(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function move(idx: number, delta: -1 | 1) {
    const target = idx + delta;
    if (target < 0 || target >= initial.length) return;
    await Promise.all([
      update(initial[idx].id, { order: target }),
      update(initial[target].id, { order: idx }),
    ]);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-3">
          <h2 className="font-bold text-lg">Add FAQ</h2>
          <div className="space-y-1">
            <Label>Question (will be uppercased)</Label>
            <Input value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Answer</Label>
            <Textarea rows={3} value={a} onChange={(e) => setA(e.target.value)} />
          </div>
          <Button onClick={create}>
            <Plus className="w-4 h-4" /> ADD
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {initial.map((f, idx) => (
          <Item
            key={f.id}
            item={f}
            onSave={(patch) => update(f.id, patch)}
            onDelete={() => destroy(f.id)}
            onUp={idx > 0 ? () => move(idx, -1) : undefined}
            onDown={idx < initial.length - 1 ? () => move(idx, 1) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

function Item({
  item,
  onSave,
  onDelete,
  onUp,
  onDown,
}: {
  item: Item;
  onSave: (patch: Partial<Item>) => void;
  onDelete: () => void;
  onUp?: () => void;
  onDown?: () => void;
}) {
  const [draft, setDraft] = useState<Item>(item);
  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <Label>Question</Label>
          <Input
            value={draft.question}
            onChange={(e) =>
              setDraft((d) => ({ ...d, question: e.target.value.toUpperCase() }))
            }
          />
        </div>
        <div className="space-y-1">
          <Label>Answer</Label>
          <Textarea
            rows={3}
            value={draft.answer}
            onChange={(e) => setDraft((d) => ({ ...d, answer: e.target.value }))}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1">
            <button
              type="button"
              disabled={!onUp}
              onClick={onUp}
              className="p-2 rounded border border-black/15 disabled:opacity-40"
              aria-label="Move up"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={!onDown}
              onClick={onDown}
              className="p-2 rounded border border-black/15 disabled:opacity-40"
              aria-label="Move down"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <span className="text-xs text-black/50 ml-2 self-center">order: {item.order}</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onSave(draft)}>
              <Save className="w-4 h-4" />
              Save
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
