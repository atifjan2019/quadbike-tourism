import { headers } from "next/headers";
import MediaManager from "@/components/admin/MediaManager";

export const dynamic = "force-dynamic";

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

async function getMedia(): Promise<FileItem[]> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const cookie = h.get("cookie") ?? "";
  const res = await fetch(`${proto}://${host}/api/admin/media`, {
    headers: { cookie },
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.media ?? [];
}

export default async function MediaPage() {
  const media = await getMedia();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Media Library</h1>
        <p className="text-black/60 text-sm">
          All images in <code>/public/images/</code> and <code>/public/uploads/</code>. Upload new files (resized to max 1600px WebP) or delete existing ones.
        </p>
      </div>
      <MediaManager initial={media} />
    </div>
  );
}
