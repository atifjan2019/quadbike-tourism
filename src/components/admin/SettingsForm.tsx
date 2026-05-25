"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Save } from "lucide-react";

type Settings = {
  whatsapp?: string;
  currency?: string;
  contactEmail?: string;
  contactPhone?: string;
  siteName?: string;
  [k: string]: unknown;
};

export default function SettingsForm({ initial }: { initial: Settings }) {
  const [s, setS] = useState<Settings>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      setSaved(true);
    } finally {
      setSaving(false);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  const set = <K extends keyof Settings>(k: K, v: string) =>
    setS((p) => ({ ...p, [k]: v }));

  return (
    <Card>
      <CardContent className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Site Name</Label>
            <Input value={(s.siteName as string) ?? ""} onChange={(e) => set("siteName", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Currency</Label>
            <Input value={(s.currency as string) ?? ""} onChange={(e) => set("currency", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Contact Email</Label>
            <Input
              type="email"
              value={(s.contactEmail as string) ?? ""}
              onChange={(e) => set("contactEmail", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Contact Phone</Label>
            <Input
              value={(s.contactPhone as string) ?? ""}
              onChange={(e) => set("contactPhone", e.target.value)}
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>WhatsApp Number (international, no + or spaces)</Label>
            <Input
              value={(s.whatsapp as string) ?? ""}
              onChange={(e) => set("whatsapp", e.target.value)}
              placeholder="971500000000"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button onClick={save} disabled={saving}>
            <Save className="w-4 h-4" />
            {saving ? "Saving…" : "Save Settings"}
          </Button>
          {saved && <span className="text-sm text-green-700 font-bold">Saved ✓</span>}
        </div>
      </CardContent>
    </Card>
  );
}
