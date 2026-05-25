"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Trash2, Upload, Copy } from "lucide-react";

type MediaItem = { id: string; url: string; filename: string; alt: string | null };

export default function MediaManager({ initial }: { initial: MediaItem[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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

  async function destroy(id: string) {
    if (!confirm("Delete this media file?")) return;
    await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    router.refresh();
  }

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
              JPG, PNG, WebP or AVIF. Max 8 MB each.
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

      {initial.length === 0 ? (
        <p className="text-sm text-black/60">No media uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {initial.map((m) => (
            <Card key={m.id}>
              <div className="relative w-full aspect-square bg-black/5">
                <Image src={m.url} alt={m.alt ?? m.filename} fill sizes="240px" className="object-cover" />
              </div>
              <CardContent className="p-3 space-y-2">
                <div className="text-xs truncate font-mono" title={m.filename}>
                  {m.filename}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(m.url)}
                    className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-bold uppercase border border-black/20 rounded px-2 py-1.5 hover:bg-black/5"
                  >
                    <Copy className="w-3 h-3" /> URL
                  </button>
                  <button
                    onClick={() => destroy(m.id)}
                    className="inline-flex items-center justify-center text-red-600 hover:text-red-800 border border-red-200 rounded px-2 py-1.5"
                    aria-label="Delete"
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
