"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Trash2, Upload, Copy, Folder } from "lucide-react";

type FileItem = {
  id: string;
  url: string;
  filename: string;
  source: "images" | "uploads";
  sizeKB: number;
  modifiedAt: string;
  dbId: string | null;
  alt: string | null;
};

export default function MediaManager({ initial }: { initial: FileItem[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "images" | "uploads">("all");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const visible = useMemo(() => {
    return initial.filter((m) => {
      if (filter !== "all" && m.source !== filter) return false;
      if (query && !m.filename.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [initial, filter, query]);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setErr(null);
    try {
      for (const f of Array.from(files)) {
        const form = new FormData();
        form.append("file", f);
        const res = await fetch("/api/admin/media/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "Upload failed");
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
    router.refresh();
  }

  async function copy(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
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
            className="border-2 border-dashed border-black/20 rounded-lg p-8 text-center cursor-pointer hover:bg-black/[0.02]"
          >
            <Upload className="w-8 h-8 mx-auto text-black/40" />
            <p className="mt-3 font-bold">Drop images here or click to upload</p>
            <p className="text-xs text-black/50 mt-1">
              JPG, PNG, WebP or AVIF. Max 8 MB each. Resized to max 1600px WebP and saved to <code>/public/uploads/</code>.
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              hidden
              onChange={(e) => upload(e.target.files)}
            />
            <Button className="mt-4" disabled={busy}>
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
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-black/60 py-10 text-center">No matching files.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {visible.map((m) => (
            <Card key={m.id}>
              <div className="relative w-full aspect-square bg-black/5">
                <Image
                  src={m.url}
                  alt={m.alt ?? m.filename}
                  fill
                  sizes="220px"
                  className="object-contain"
                  unoptimized
                />
                <Badge
                  variant={m.source === "uploads" ? "default" : "muted"}
                  className="absolute top-2 left-2"
                >
                  <Folder className="w-3 h-3 mr-1" />
                  /{m.source}
                </Badge>
              </div>
              <CardContent className="p-3 space-y-2">
                <div className="text-xs truncate font-mono" title={m.filename}>
                  {m.filename}
                </div>
                <div className="text-[10px] text-black/50 flex justify-between">
                  <span>{m.sizeKB} KB</span>
                  <span>{new Date(m.modifiedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copy(m.url)}
                    className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-bold uppercase border border-black/20 rounded px-2 py-1.5 hover:bg-black/5"
                  >
                    <Copy className="w-3 h-3" />
                    {copied === m.url ? "Copied!" : "URL"}
                  </button>
                  <button
                    onClick={() => destroy(m)}
                    className="inline-flex items-center justify-center text-red-600 hover:text-red-800 border border-red-200 rounded px-2 py-1.5"
                    aria-label="Delete from disk"
                    title="Delete from disk"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
