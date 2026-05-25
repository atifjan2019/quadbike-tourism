"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { Trash2, Plus, Save, Pencil } from "lucide-react";

type Cat = {
  id: string;
  name: string;
  slug: string;
  order: number;
  postCount: number;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogCategoriesManager({ initial }: { initial: Cat[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Cat>>({});

  async function create() {
    if (!name) return;
    await fetch("/api/admin/blog-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug: slug || slugify(name),
        order: initial.length,
      }),
    });
    setName("");
    setSlug("");
    router.refresh();
  }

  async function update(id: string) {
    await fetch(`/api/admin/blog-categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setEditingId(null);
    setDraft({});
    router.refresh();
  }

  async function destroy(id: string) {
    if (!confirm("Delete this category? Posts in it will become uncategorised.")) return;
    const res = await fetch(`/api/admin/blog-categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Could not delete.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="font-bold text-lg">Add Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slug) setSlug(slugify(e.target.value));
                }}
              />
            </div>
            <div className="space-y-1">
              <Label>Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
            </div>
          </div>
          <Button onClick={create}>
            <Plus className="w-4 h-4" />
            ADD
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Slug</TH>
                <TH>Order</TH>
                <TH>Posts</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {initial.length === 0 ? (
                <TR>
                  <TD className="py-10 text-center text-black/50" colSpan={5}>
                    No categories yet.
                  </TD>
                </TR>
              ) : (
                initial.map((c) => {
                  const editing = editingId === c.id;
                  return (
                    <TR key={c.id}>
                      <TD>
                        {editing ? (
                          <Input
                            defaultValue={c.name}
                            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                          />
                        ) : (
                          c.name
                        )}
                      </TD>
                      <TD>
                        {editing ? (
                          <Input
                            defaultValue={c.slug}
                            onChange={(e) =>
                              setDraft((d) => ({ ...d, slug: slugify(e.target.value) }))
                            }
                          />
                        ) : (
                          <code className="text-xs">/{c.slug}</code>
                        )}
                      </TD>
                      <TD>
                        {editing ? (
                          <Input
                            type="number"
                            defaultValue={c.order}
                            onChange={(e) =>
                              setDraft((d) => ({
                                ...d,
                                order: parseInt(e.target.value || "0"),
                              }))
                            }
                          />
                        ) : (
                          c.order
                        )}
                      </TD>
                      <TD>{c.postCount}</TD>
                      <TD className="text-right">
                        {editing ? (
                          <button
                            className="font-bold text-sm hover:underline mr-3"
                            onClick={() => update(c.id)}
                          >
                            <Save className="inline w-4 h-4 mr-1" />
                            Save
                          </button>
                        ) : (
                          <button
                            className="font-bold text-sm hover:underline mr-3"
                            onClick={() => {
                              setEditingId(c.id);
                              setDraft({});
                            }}
                          >
                            <Pencil className="inline w-4 h-4 mr-1" />
                            Edit
                          </button>
                        )}
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => destroy(c.id)}
                          aria-label="Delete"
                        >
                          <Trash2 className="inline w-4 h-4" />
                        </button>
                      </TD>
                    </TR>
                  );
                })
              )}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
