import { afriframe } from "./client";

export type PublicMedia = {
  id: string;
  title: string;
  description: string | null;
  mediaUrl: string;
  posterUrl: string | null;
  category: string;
  mediaType: "image" | "video";
  visible: boolean;
  featured: boolean;
  displayOrder: number;
  createdAt: string | null;
  updatedAt: string | null;
};

const first = (row: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) if (row[key] != null && row[key] !== "") return row[key];
  return null;
};

const normalize = (row: Record<string, unknown>, mediaType: PublicMedia["mediaType"]): PublicMedia | null => {
  const mediaUrl = first(row, ["media_url", "url", "image_url", "video_url", "storage_path", "file_url"]);
  if (typeof mediaUrl !== "string" || !mediaUrl) return null;

  const category = String(first(row, ["category", "collection", "album"]) ?? "Other");
  return {
    id: String(row.id ?? mediaUrl),
    title: String(first(row, ["title", "name"]) ?? category),
    description: (first(row, ["description", "caption"]) as string | null) ?? null,
    mediaUrl,
    posterUrl: (first(row, ["poster_url", "thumbnail_url", "cover_url"]) as string | null) ?? null,
    category,
    mediaType,
    visible: Boolean(first(row, ["visible", "is_visible", "public", "published"]) ?? true),
    featured: Boolean(first(row, ["featured", "is_featured"]) ?? false),
    displayOrder: Number(first(row, ["display_order", "sort_order", "position"]) ?? 0),
    createdAt: (row.created_at as string | null) ?? null,
    updatedAt: (row.updated_at as string | null) ?? null,
  };
};

export async function fetchPublicMedia(): Promise<PublicMedia[]> {
  const [photos, videos] = await Promise.all([
    afriframe.from("photography_gallery").select("*").order("display_order", { ascending: true }),
    afriframe.from("videography_gallery").select("*").order("display_order", { ascending: true }),
  ]);

  if (photos.error) console.error("[media] photography load failed:", photos.error);
  if (videos.error) console.error("[media] videography load failed:", videos.error);

  return [
    ...((photos.data ?? []) as Record<string, unknown>[]).map((row) => normalize(row, "image")),
    ...((videos.data ?? []) as Record<string, unknown>[]).map((row) => normalize(row, "video")),
  ]
    .filter((item): item is PublicMedia => item !== null && item.visible)
    .sort((a, b) => a.displayOrder - b.displayOrder || a.title.localeCompare(b.title));
}

