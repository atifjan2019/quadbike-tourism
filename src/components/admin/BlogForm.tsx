"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Card, CardContent } from "@/components/ui/Card";
import QuillEditor from "./QuillEditor";
import { Trash2 } from "lucide-react";

type Initial = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string | null; // ISO
  seoTitle: string;
  seoDesc: string;
  categoryId: string | null;
};

const blank: Initial = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  author: "Quad Bike Tourism",
  status: "DRAFT",
  publishedAt: null,
  seoTitle: "",
  seoDesc: "",
  categoryId: null,
};

export type BlogCategoryOption = { id: string; name: string };

function countWords(html: string): number {
  if (!html) return 0;
  const text = html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").trim();
  if (!text) return 0;
  return text.split(/\s+/).length;
}

function SeoMeter({
  value,
  min,
  max,
  unit,
}: {
  value: number;
  min: number;
  max: number;
  unit: "chars" | "words";
}) {
  let state: "low" | "ok" | "high" = "ok";
  if (value < min) state = "low";
  else if (value > max) state = "high";

  const colorCls =
    state === "ok"
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : state === "low"
        ? "text-amber-700 bg-amber-50 border-amber-200"
        : "text-red-700 bg-red-50 border-red-200";

  const label =
    state === "ok"
      ? "Optimal"
      : state === "low"
        ? unit === "chars"
          ? "Too short"
          : "Too few"
        : unit === "chars"
          ? "Too long"
          : "Too many";

  return (
    <div className="flex items-center justify-between text-[11px] mt-1">
      <span className="text-black/50">
        Ideal: {min}–{max} {unit}
      </span>
      <span
        className={`px-2 py-0.5 rounded border font-bold tracking-wide uppercase ${colorCls}`}
      >
        {value} {unit} · {label}
      </span>
    </div>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toLocalInputValue(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function BlogForm({
  initial,
  mode,
  categories,
}: {
  initial?: Initial;
  mode: "create" | "edit";
  categories: BlogCategoryOption[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<Initial>(initial ?? blank);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const set = <K extends keyof Initial>(k: K, v: Initial[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setErr(null);
    setSaving(true);
    try {
      const url =
        mode === "create" ? "/api/admin/blog" : `/api/admin/blog/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error?.[0]?.message || data.error || "Save failed");
      }
      router.push("/admin/blogs");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function destroy() {
    if (!initial?.id || !confirm("Delete this blog post permanently?")) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/blog/${initial.id}`, { method: "DELETE" });
      router.push("/admin/blogs");
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
          <TabsTrigger value="content">Content</TabsTrigger>
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
                  <SeoMeter
                    value={form.title.length}
                    min={50}
                    max={60}
                    unit="chars"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => set("slug", slugify(e.target.value))}
                  />
                  <p className="text-[11px] text-black/50">
                    Public URL: <code>/blog/{form.slug || "your-slug"}/</code>
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <Label>Excerpt</Label>
                <Textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => set("excerpt", e.target.value)}
                  placeholder="Short summary shown in the blog list"
                />
                <SeoMeter
                  value={form.excerpt.length}
                  min={120}
                  max={160}
                  unit="chars"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Author</Label>
                  <Input
                    value={form.author}
                    onChange={(e) => set("author", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Featured Image URL</Label>
                  <Input
                    value={form.featuredImage}
                    onChange={(e) => set("featuredImage", e.target.value)}
                    placeholder="/uploads/… or /images/…"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="categoryId">Category</Label>
                <select
                  id="categoryId"
                  value={form.categoryId ?? ""}
                  onChange={(e) =>
                    set("categoryId", e.target.value ? e.target.value : null)
                  }
                  className="h-10 w-full px-3 rounded-md border border-black/20 bg-white text-sm"
                >
                  <option value="">— None —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-black/50">
                  Manage categories from{" "}
                  <a href="/admin/blog-categories/" className="underline">
                    Blog Categories
                  </a>
                  .
                </p>
              </div>
              {(() => {
                const now = Date.now();
                const pubMs = form.publishedAt ? new Date(form.publishedAt).getTime() : null;
                const displayStatus: "DRAFT" | "SCHEDULED" | "PUBLISHED" =
                  form.status !== "PUBLISHED"
                    ? "DRAFT"
                    : pubMs !== null && pubMs > now
                      ? "SCHEDULED"
                      : "PUBLISHED";

                const setStatus = (next: "DRAFT" | "SCHEDULED" | "PUBLISHED") => {
                  if (next === "DRAFT") {
                    set("status", "DRAFT");
                    // keep publishedAt — it's preserved if they re-publish later
                  } else if (next === "PUBLISHED") {
                    set("status", "PUBLISHED");
                    if (!form.publishedAt || (pubMs !== null && pubMs > now)) {
                      set("publishedAt", new Date().toISOString());
                    }
                  } else {
                    // SCHEDULED — needs a future date
                    set("status", "PUBLISHED");
                    if (!form.publishedAt || pubMs === null || pubMs <= now) {
                      const tomorrow = new Date(now + 24 * 60 * 60 * 1000);
                      set("publishedAt", tomorrow.toISOString());
                    }
                  }
                };

                const pillBase =
                  "px-4 h-9 inline-flex items-center justify-center font-bold text-[12px] uppercase tracking-[2px] rounded transition border-2";
                const pillActive: Record<typeof displayStatus, string> = {
                  DRAFT: "bg-zinc-200 text-zinc-800 border-zinc-400",
                  SCHEDULED: "bg-amber-100 text-amber-900 border-amber-400",
                  PUBLISHED: "bg-emerald-100 text-emerald-900 border-emerald-500",
                };
                const pillInactive = "bg-white text-black/60 border-black/15 hover:bg-black/5";

                return (
                  <div className="space-y-3 pt-2 border-t border-black/10">
                    <Label>Status</Label>
                    <div className="flex flex-wrap gap-2">
                      {(["DRAFT", "SCHEDULED", "PUBLISHED"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStatus(s)}
                          className={`${pillBase} ${displayStatus === s ? pillActive[s] : pillInactive}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    {(displayStatus === "SCHEDULED" || displayStatus === "PUBLISHED") && (
                      <div className="space-y-1 max-w-md">
                        <Label>
                          {displayStatus === "SCHEDULED" ? "Scheduled For" : "Published On"}
                        </Label>
                        <Input
                          type="datetime-local"
                          value={toLocalInputValue(form.publishedAt)}
                          onChange={(e) =>
                            set(
                              "publishedAt",
                              e.target.value ? new Date(e.target.value).toISOString() : null,
                            )
                          }
                        />
                        {displayStatus === "SCHEDULED" && (
                          <p className="text-[11px] text-amber-700">
                            Hidden from the public site until this date/time.
                          </p>
                        )}
                        {displayStatus === "PUBLISHED" && (
                          <p className="text-[11px] text-black/50">
                            Live now. Set a future date to schedule instead.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Body</Label>
                <span className="text-[11px] text-black/60">
                  <strong className="text-black">{countWords(form.content)}</strong> words
                </span>
              </div>
              <QuillEditor
                value={form.content}
                onChange={(html) => set("content", html)}
              />
              <SeoMeter
                value={countWords(form.content)}
                min={600}
                max={2500}
                unit="words"
              />
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
                  placeholder="Falls back to post title"
                />
                <SeoMeter
                  value={(form.seoTitle || form.title).length}
                  min={50}
                  max={60}
                  unit="chars"
                />
              </div>
              <div className="space-y-1">
                <Label>SEO Description</Label>
                <Textarea
                  rows={3}
                  value={form.seoDesc}
                  onChange={(e) => set("seoDesc", e.target.value)}
                  placeholder="Falls back to excerpt"
                />
                <SeoMeter
                  value={(form.seoDesc || form.excerpt).length}
                  min={120}
                  max={160}
                  unit="chars"
                />
              </div>
              <div className="pt-4 border-t border-black/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
                <div className="bg-black/5 rounded px-3 py-2">
                  <div className="text-black/50 uppercase tracking-wider text-[10px]">Body words</div>
                  <div className="font-extrabold text-black mt-0.5">{countWords(form.content)}</div>
                </div>
                <div className="bg-black/5 rounded px-3 py-2">
                  <div className="text-black/50 uppercase tracking-wider text-[10px]">Title chars</div>
                  <div className="font-extrabold text-black mt-0.5">{(form.seoTitle || form.title).length}</div>
                </div>
                <div className="bg-black/5 rounded px-3 py-2">
                  <div className="text-black/50 uppercase tracking-wider text-[10px]">Excerpt chars</div>
                  <div className="font-extrabold text-black mt-0.5">{form.excerpt.length}</div>
                </div>
                <div className="bg-black/5 rounded px-3 py-2">
                  <div className="text-black/50 uppercase tracking-wider text-[10px]">Desc chars</div>
                  <div className="font-extrabold text-black mt-0.5">{(form.seoDesc || form.excerpt).length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between pt-4 border-t border-black/10">
        <Button variant="outline" onClick={() => router.push("/admin/blogs")}>
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
            {saving ? "Saving…" : mode === "create" ? "Create Post" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
