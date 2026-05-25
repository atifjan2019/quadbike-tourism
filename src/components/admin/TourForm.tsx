"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Card, CardContent } from "@/components/ui/Card";
import RichEditor from "./RichEditor";
import { Trash2, Plus } from "lucide-react";

type Initial = {
  id?: string;
  title: string;
  slug: string;
  categoryId: string;
  shortDesc: string;
  description: string;
  featuredImage: string;
  gallery: string[];
  priceFrom: number;
  durationMin: number | null;
  maxGuests: number | null;
  includes: string[];
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
  seoTitle: string;
  seoDesc: string;
};

const blank: Initial = {
  title: "",
  slug: "",
  categoryId: "",
  shortDesc: "",
  description: "",
  featuredImage: "",
  gallery: [],
  priceFrom: 0,
  durationMin: null,
  maxGuests: null,
  includes: ["Free Cancellation", "Free Pickup & Drop-off", "Instant Booking"],
  status: "DRAFT",
  featured: false,
  seoTitle: "",
  seoDesc: "",
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function TourForm({
  categories,
  initial,
  mode,
}: {
  categories: { id: string; name: string }[];
  initial?: Initial;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [form, setForm] = useState<Initial>(initial ?? blank);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [includeInput, setIncludeInput] = useState("");
  const [galleryInput, setGalleryInput] = useState("");

  const set = <K extends keyof Initial>(k: K, v: Initial[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setErr(null);
    setSaving(true);
    try {
      const url =
        mode === "create" ? "/api/admin/tours" : `/api/admin/tours/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error?.[0]?.message || data.error || "Save failed");
      router.push("/admin/tours");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function destroy() {
    if (!initial?.id || !confirm("Delete this tour permanently?")) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/tours/${initial.id}`, { method: "DELETE" });
      router.push("/admin/tours");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {err && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
          {err}
        </div>
      )}
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="includes">Includes</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => {
                      set("title", e.target.value);
                      if (mode === "create" && !form.slug)
                        set("slug", slugify(e.target.value));
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => set("slug", slugify(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  id="categoryId"
                  value={form.categoryId}
                  onChange={(e) => set("categoryId", e.target.value)}
                >
                  <option value="">— Choose —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="shortDesc">Short description</Label>
                <Textarea
                  id="shortDesc"
                  rows={2}
                  value={form.shortDesc}
                  onChange={(e) => set("shortDesc", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <RichEditor
                  value={form.description}
                  onChange={(html) => set("description", html)}
                />
              </div>
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={form.status === "PUBLISHED"}
                    onCheckedChange={(v) => set("status", v ? "PUBLISHED" : "DRAFT")}
                  />
                  <span className="font-semibold">Published</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={form.featured}
                    onCheckedChange={(v) => set("featured", v)}
                  />
                  <span className="font-semibold">Featured</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label>Price From (AED)</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.priceFrom}
                    onChange={(e) => set("priceFrom", parseFloat(e.target.value || "0"))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.durationMin ?? ""}
                    onChange={(e) =>
                      set("durationMin", e.target.value ? parseInt(e.target.value) : null)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Max guests</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.maxGuests ?? ""}
                    onChange={(e) =>
                      set("maxGuests", e.target.value ? parseInt(e.target.value) : null)
                    }
                  />
                </div>
              </div>
              <p className="text-xs text-black/50">
                Variations (multi-tier pricing) can be added later from the API — UI coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="includes">
          <Card>
            <CardContent className="space-y-4">
              <Label>What&apos;s included</Label>
              <div className="flex gap-2">
                <Input
                  value={includeInput}
                  onChange={(e) => setIncludeInput(e.target.value)}
                  placeholder="e.g. Free Cancellation"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (includeInput.trim()) {
                        set("includes", [...form.includes, includeInput.trim()]);
                        setIncludeInput("");
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    if (includeInput.trim()) {
                      set("includes", [...form.includes, includeInput.trim()]);
                      setIncludeInput("");
                    }
                  }}
                >
                  <Plus className="w-4 h-4" />
                  ADD
                </Button>
              </div>
              <ul className="space-y-2">
                {form.includes.map((it, i) => (
                  <li
                    key={`${it}-${i}`}
                    className="flex items-center justify-between bg-zinc-100 rounded px-3 py-2"
                  >
                    <span className="text-sm">{it}</span>
                    <button
                      type="button"
                      className="text-black/60 hover:text-red-600"
                      onClick={() =>
                        set("includes", form.includes.filter((_, j) => j !== i))
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Featured image URL</Label>
                <Input
                  value={form.featuredImage}
                  onChange={(e) => set("featuredImage", e.target.value)}
                  placeholder="/uploads/… or /images/…"
                />
                <p className="text-xs text-black/50">
                  Upload images at <a href="/admin/media" className="underline">/admin/media</a> and paste the URL here.
                </p>
              </div>
              <div className="space-y-1">
                <Label>Gallery</Label>
                <div className="flex gap-2">
                  <Input
                    value={galleryInput}
                    onChange={(e) => setGalleryInput(e.target.value)}
                    placeholder="/uploads/…"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (galleryInput.trim()) {
                          set("gallery", [...form.gallery, galleryInput.trim()]);
                          setGalleryInput("");
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      if (galleryInput.trim()) {
                        set("gallery", [...form.gallery, galleryInput.trim()]);
                        setGalleryInput("");
                      }
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    ADD
                  </Button>
                </div>
                <ul className="mt-2 space-y-1">
                  {form.gallery.map((u, i) => (
                    <li
                      key={`${u}-${i}`}
                      className="flex items-center justify-between bg-zinc-100 rounded px-3 py-2 text-sm"
                    >
                      <span className="truncate mr-2">{u}</span>
                      <button
                        type="button"
                        className="text-black/60 hover:text-red-600"
                        onClick={() =>
                          set("gallery", form.gallery.filter((_, j) => j !== i))
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>SEO Title</Label>
                <Input
                  value={form.seoTitle}
                  onChange={(e) => set("seoTitle", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>SEO Description</Label>
                <Textarea
                  rows={3}
                  value={form.seoDesc}
                  onChange={(e) => set("seoDesc", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between pt-4 border-t border-black/10">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/tours")}
        >
          Cancel
        </Button>
        <div className="flex gap-3">
          {mode === "edit" && (
            <Button variant="destructive" onClick={destroy} disabled={saving}>
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          )}
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : mode === "create" ? "Create Tour" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
