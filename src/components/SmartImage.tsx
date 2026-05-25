import Image, { type ImageProps } from "next/image";
import { getImageMeta } from "@/lib/media";

type Props = Omit<ImageProps, "alt"> & {
  /** Optional override — falls back to DB alt, then filename. */
  alt?: string;
  /** Show <figcaption> with the caption from Media metadata. */
  showCaption?: boolean;
};

/**
 * Server Component image wrapper that pulls alt/title/caption/description from
 * the Media table for the given src and wires them onto the rendered <img>.
 * Use anywhere on the public site instead of next/image when you want
 * SEO-friendly alt/title text the admin can edit.
 */
export default async function SmartImage({
  src,
  alt: altOverride,
  showCaption = false,
  ...rest
}: Props) {
  const url = typeof src === "string" ? src : "";
  const meta = url ? await getImageMeta(url) : null;
  const alt = altOverride ?? meta?.alt ?? "";
  const title = meta?.title ?? undefined;

  if (showCaption && meta?.caption) {
    return (
      <figure>
        <Image src={src} alt={alt} title={title} {...rest} />
        <figcaption className="text-sm text-black/60 mt-2">{meta.caption}</figcaption>
      </figure>
    );
  }
  return <Image src={src} alt={alt} title={title} {...rest} />;
}
