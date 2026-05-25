"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={form.status === "PUBLISHED"}
                    onCheckedChange={(v) => set("status", v ? "PUBLISHED" : "DRAFT")}
                  />
                  <span className="font-semibold">Published</span>
                </label>
                <div className="space-y-1">
                  <Label>Publish Date</Label>
                  <Input
                    type="datetime-local"
                    value={toLocalInputValue(form.publishedAt)}
                    onChange={(e) =>
                      set(
                        "publishedAt",
                        e.target.value ? new Date(e.target.value).toISOString() : null
                      )
                    }
                  />
                  <p className="text-[11px] text-black/50">
                    Auto-set to now when first publishing if left blank.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardContent className="space-y-2">
              <Label>Body</Label>
              <QuillEditor
                value={form.content}
                onChange={(html) => set("content", html)}
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
              </div>
              <div className="space-y-1">
                <Label>SEO Description</Label>
                <Textarea
                  rows={3}
                  value={form.seoDesc}
                  onChange={(e) => set("seoDesc", e.target.value)}
                  placeholder="Falls back to excerpt"
                />
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
