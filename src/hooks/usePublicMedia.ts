import { useCallback, useEffect, useState } from "react";
import { afriframe } from "@/integrations/afriframe/client";
import { fetchPublicMedia, type PublicMedia } from "@/integrations/afriframe/media";

export function usePublicMedia() {
  const [media, setMedia] = useState<PublicMedia[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setMedia(await fetchPublicMedia());
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    const channel = afriframe
      .channel("public-portfolio-media")
      .on("postgres_changes", { event: "*", schema: "public", table: "photography_gallery" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "videography_gallery" }, refresh)
      .subscribe();

    const onFocus = () => void refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      afriframe.removeChannel(channel);
    };
  }, [refresh]);

  return { media, loading, refresh };
}
