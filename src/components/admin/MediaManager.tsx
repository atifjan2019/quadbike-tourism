"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Trash2, Upload, Copy, X, Pencil, ChevronLeft, ChevronRight, Link as LinkIcon, Check } from "lucide-react";

type FileItem = {
  id: string;
  url: string;
  filename: string;
  source: "images" | "uploads";
  sizeKB: number;
  modifiedAt: string;
  dbId: string | null;
  alt: string | null;
  title: string | null;
  caption: string | null;
  description: string | null;
};

const PER_PAGE = 30;

export default function MediaManager({ initial }: { initial: FileItem[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "images" | "uploads">("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<FileItem | null>(null);
  const [origin, setOrigin] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyUrl(url: string, id: string) {
    const full = /^https?:\/\//i.test(url) ? url : origin ? `${origin}${url}` : url;
    await navigator.clipboard.writeText(full);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1200);
  }

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const visible = useMemo(() => {
    return initial.filter((m) => {
      if (filter !== "all" && m.source !== filter) return false;
      if (query && !m.filename.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [initial, filter, query]);

  useEffect(() => setPage(1), [filter, query]);
  const totalPages = Math.max(1, Math.ceil(visible.length / PER_PAGE));
  const pageSafe = Math.min(page, totalPages);
  const pageItems = visible.slice((pageSafe - 1) * PER_PAGE, pageSafe * PER_PAGE);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setErr(null);
    try {
      for (const f of Array.from(files)) {
        const form = new FormData();
        form.append("file", f);
        const res = await fetch("/api/admin/media/upload", { method: "POST", body: form });
        const text = await res.text();
        let data: { ok?: boolean; error?: string } = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          throw new Error(text.slice(0, 300) || `Upload failed (HTTP ${res.status})`);
        }
        if (!res.ok || !data.ok) throw new Error(data.error || `Upload failed (HTTP ${res.status})`);
      }
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function destroy(item: FileItem) {
    if (!confirm(`Delete ${item.filename} from disk?\n\nThis removes the file permanently.`)) return;
    const res = await fetch(`/api/admin/media?url=${encodeURIComponent(item.url)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Delete failed");
      return;
    }
    if (editing?.url === item.url) setEditing(null);
    router.refresh();
  }

  const counts = useMemo(
    () => ({
      all: initial.length,
      images: initial.filter((m) => m.source === "images").length,
      uploads: initial.filter((m) => m.source === "uploads").length,
    }),
    [initial]
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              upload(e.dataTransfer.files);
            }}
            className="border-2 border-dashed border-black/20 rounded-lg p-6 text-center cursor-pointer hover:bg-black/[0.02]"
          >
            <Upload className="w-7 h-7 mx-auto text-black/40" />
            <p className="mt-2 font-bold">Drop images here or click to upload</p>
            <p className="text-xs text-black/50 mt-1">
              JPG, PNG, WebP or AVIF. Max 8 MB each. Resized to max 1600px WebP and saved to cloud storage.
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              hidden
              onChange={(e) => upload(e.target.files)}
            />
            <Button className="mt-3" disabled={busy}>
              {busy ? "Uploading…" : "CHOOSE FILES"}
            </Button>
          </div>
          {err && <p className="mt-3 text-sm text-red-600 font-semibold">{err}</p>}
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 bg-zinc-100 rounded-md p-1">
          {(["all", "images", "uploads"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-4 py-1.5 rounded text-[13px] font-bold uppercase tracking-wider transition ${
                filter === k ? "bg-white shadow-sm text-black" : "text-black/60 hover:text-black"
              }`}
            >
              {k === "all" ? "All" : k === "images" ? "/images" : "/uploads"}{" "}
              <span className="opacity-50 ml-1">({counts[k]})</span>
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search filename…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 min-w-[200px] max-w-[320px] h-9 px-3 rounded-md border border-black/20 bg-white text-sm"
        />
        <span className="text-xs text-black/50 ml-auto">
          {visible.length} file{visible.length === 1 ? "" : "s"}
        </span>
      </div>

      {pageItems.length === 0 ? (
        <p className="text-sm text-black/60 py-10 text-center">No matching files.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {pageItems.map((m) => (
            <div
              key={m.id}
              className="group relative bg-white border border-black/10 rounded overflow-hidden hover:shadow-md transition"
            >
              <div className="relative aspect-square bg-black/5">
                <Image
                  src={m.url}
                  alt={m.alt ?? m.filename}
                  fill
                  sizes="160px"
                  className="object-contain"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
                {/* Action toolbar — both icons grouped at top-right on hover */}
                <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    type="button"
                    onClick={() => setEditing(m)}
                    title="Edit"
                    aria-label={`Edit ${m.filename}`}
                    className="w-7 h-7 inline-flex items-center justify-center rounded-md bg-white/95 hover:bg-white text-black shadow"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => copyUrl(m.url, m.id)}
                    title="Copy URL"
                    aria-label="Copy URL"
                    className="w-7 h-7 inline-flex items-center justify-center rounded-md bg-white/95 hover:bg-white text-black shadow"
                  >
                    {copiedId === m.id ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <LinkIcon className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="p-1.5">
                <div className="text-[10px] truncate font-mono text-black/70" title={m.filename}>
                  {m.filename}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            disabled={pageSafe === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-md border border-black/15 text-sm font-bold disabled:opacity-40 hover:bg-black/5"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>
          <span className="text-sm text-black/70">
            Page <b>{pageSafe}</b> of {totalPages}
          </span>
          <button
            disabled={pageSafe === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-md border border-black/15 text-sm font-bold disabled:opacity-40 hover:bg-black/5"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <EditModal
          item={editing}
          origin={origin}
          onClose={() => setEditing(null)}
          onDelete={() => destroy(editing)}
          onSaved={() => router.refresh()}
        />
      )}
    </div>
  );
}

function EditModal({
  item,
  origin,
  onClose,
  onDelete,
  onSaved,
}: {
  item: FileItem;
  origin: string;
  onClose: () => void;
  onDelete: () => void;
  onSaved: () => void;
}) {
  const [alt, setAlt] = useState(item.alt ?? "");
  const [title, setTitle] = useState(item.title ?? "");
  const [caption, setCaption] = useState(item.caption ?? "");
  const [description, setDescription] = useState(item.description ?? "");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const fullUrl = /^https?:\/\//i.test(item.url)
    ? item.url
    : origin
    ? `${origin}${item.url}`
    : item.url;

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/media/meta", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: item.url,
          alt: alt || null,
          title: title || null,
          caption: caption || null,
          description: description || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Save failed");
      } else {
        onSaved();
        onClose();
      }
    } finally {
      setSaving(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-3">
          <h3 className="font-bold text-lg">Edit Image</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-black/5"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5">
          {/* Preview */}
          <div>
            <div className="relative w-full aspect-square bg-zinc-100 rounded border border-black/10 overflow-hidden">
              <Image
                src={item.url}
                alt={alt || item.filename}
                fill
                sizes="500px"
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="mt-3 space-y-2 text-xs text-black/60">
              <div className="flex justify-between">
                <span>Filename</span>
                <span className="font-mono text-black/80">{item.filename}</span>
              </div>
              <div className="flex justify-between">
                <span>Size</span>
                <span>{item.sizeKB} KB</span>
              </div>
              <div className="flex justify-between">
                <span>Folder</span>
                <code>/public/{item.source}/</code>
              </div>
              <div className="flex justify-between">
                <span>Modified</span>
                <span>{new Date(item.modifiedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Metadata form */}
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Full URL</Label>
              <div className="flex gap-2">
                <Input value={fullUrl} readOnly className="font-mono text-[12px]" />
                <Button type="button" variant="outline" onClick={copy} className="shrink-0">
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Alternative Text</Label>
              <Textarea
                rows={2}
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Describe the image for screen readers"
              />
              <p className="text-[11px] text-black/50">
                Leave empty if the image is purely decorative.
              </p>
            </div>

            <div className="space-y-1">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-1">
              <Label>Caption</Label>
              <Textarea
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-black/10 px-5 py-3 bg-zinc-50 rounded-b-lg">
          <Button variant="destructive" onClick={onDelete} disabled={saving}>
            <Trash2 className="w-4 h-4" />
            Delete file
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
