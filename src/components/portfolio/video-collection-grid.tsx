import { Play } from "lucide-react";
import { useState } from "react";

interface VideoCollectionItem {
  id: number;
  src: string;
  title: string;
  category: string;
  description: string;
}

interface VideoCollectionGridProps {
  videos: VideoCollectionItem[];
  onSelectVideo: (video: VideoCollectionItem) => void;
  title?: string;
  subtitle?: string;
}

export function VideoCollectionGrid({
  videos,
  onSelectVideo,
  title = "Video Collections",
  subtitle = "Explore our cinematic stories",
}: VideoCollectionGridProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 animate-fade-in">
          <span className="eyebrow mb-4 block">Videography</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">{subtitle}</p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="group rounded-2xl overflow-hidden animate-fade-in cursor-pointer"
              style={{
                animationDelay: `${0.1 + index * 0.05}s`,
              }}
              onMouseEnter={() => setHoveredId(video.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectVideo(video)}
            >
              {/* Video Container */}
              <div className="relative aspect-[9/16] md:aspect-video overflow-hidden bg-background/50">
                <video
                  src={video.src}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  autoPlay
                  muted
                  loop
                  playsInline
                />

                {/* Play Button Overlay */}
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                    hoveredId === video.id
                      ? "opacity-100 bg-background/40"
                      : "opacity-0"
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center border-2 border-primary/30 transform transition-transform group-hover:scale-110">
                    <Play className="w-6 h-6 text-primary-foreground ml-1" />
                  </div>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                {/* Category Badge */}
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-primary/80 backdrop-blur-sm rounded-full text-xs font-semibold tracking-wider uppercase">
                  {video.category}
                </div>

                {/* Video Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold mb-2">
                    {video.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground/90 line-clamp-2">
                    {video.description}
                  </p>
                </div>

                {/* Border Glow on Hover */}
                <div
                  className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ${
                    hoveredId === video.id
                      ? "border-primary/40"
                      : "border-primary/10"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
