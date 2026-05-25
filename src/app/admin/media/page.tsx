import { prisma } from "@/lib/db";
import MediaManager from "@/components/admin/MediaManager";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Media Library</h1>
        <p className="text-black/60 text-sm">
          Upload images. They&apos;re resized to max 1600px wide WebP and stored under /public/uploads.
        </p>
      </div>
      <MediaManager initial={media} />
    </div>
  );
}
