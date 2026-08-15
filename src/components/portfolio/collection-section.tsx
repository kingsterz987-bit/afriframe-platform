import { useState, useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollectionImage {
  src: string;
  title?: string;
  size?: "small" | "medium" | "large"; // for grid layout
}

interface CollectionSectionProps {
  title: string;
  category: string;
  description?: string;
  frameCount?: number;
  featuredImage: string;
  supportingImages?: CollectionImage[];
  onViewCollection?: () => void;
  index?: number;
}

export const CollectionSection = ({
  title,
  category,
  description,
  frameCount,
  featuredImage,
  supportingImages = [],
  onViewCollection,
  index = 0,
}: CollectionSectionProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementTop = rect.top;
        const elementBottom = rect.bottom;

        // Calculate parallax offset
        if (elementBottom > 0 && elementTop < windowHeight) {
          const progress = (windowHeight - elementTop) / (windowHeight + rect.height);
          setScrollProgress(Math.max(0, Math.min(1, progress)));
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxOffset = (1 - scrollProgress) * 20; // 0-20px parallax offset

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 border-b border-border/50 last:border-b-0"
      style={{
        opacity: isVisible ? 1 : 0.8,
        transition: "opacity 0.6s ease-out",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Featured Image with Parallax */}
          <div
            className="group relative overflow-hidden rounded-2xl"
            style={{
              aspectRatio: "3/4",
              transform: `translateY(${parallaxOffset}px)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            <img
              src={featuredImage}
              alt={title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-30" />

            {/* Category Label */}
            <div className="absolute top-6 left-6">
              <span className="text-xs font-semibold tracking-wider uppercase text-primary bg-background/80 backdrop-blur-md px-4 py-2 rounded-full">
                {category}
              </span>
            </div>

            {/* Frame Count Badge */}
            {frameCount !== undefined && (
              <div className="absolute top-6 right-6">
                <span className="text-xs font-semibold tracking-wider uppercase text-white bg-primary px-4 py-2 rounded-full">
                  {frameCount} Frames
                </span>
              </div>
            )}

            {/* Hover Overlay with Details */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
              <div className="text-center">
                <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-4">
                  Explore Collection
                </p>
                <ArrowRight className="w-8 h-8 text-primary mx-auto animate-pulse" />
              </div>
            </div>

            {/* Subtle Border Glow */}
            <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/40 transition-all duration-500" />
          </div>

          {/* Right: Supporting Images Grid + Details */}
          <div className="flex flex-col gap-8">
            {/* Collection Title & Description */}
            <div
              className="animate-fade-in"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight font-playfair">
                {title}
              </h2>
              {description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Supporting Images Grid */}
            {supportingImages.length > 0 && (
              <div
                className="grid grid-cols-3 gap-3 md:gap-4"
                style={{
                  animation: isVisible ? "fade-in 0.6s ease-out forwards" : "none",
                  animationDelay: `${index * 0.1 + 0.1}s`,
                  opacity: isVisible ? 1 : 0,
                }}
              >
                {supportingImages.map((img, i) => (
                  <div
                    key={i}
                    className="group/img relative rounded-lg overflow-hidden bg-secondary hover:scale-105 transition-all duration-500 cursor-pointer"
                    style={{
                      aspectRatio: img.size === "large" ? "1" : img.size === "medium" ? "1" : "1",
                      gridColumn:
                        img.size === "large"
                          ? "span 2"
                          : img.size === "medium"
                            ? "span 2"
                            : "span 1",
                      gridRow:
                        img.size === "large"
                          ? "span 2"
                          : img.size === "medium"
                            ? "span 1"
                            : "span 1",
                    }}
                  >
                    <img
                      src={img.src}
                      alt={img.title || "Collection image"}
                      className="w-full h-full object-cover transition-all duration-700 group-hover/img:scale-110"
                    />

                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500" />

                    {/* Title on Hover */}
                    {img.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-4 group-hover/img:translate-y-0 transition-transform duration-500">
                        <p className="text-sm font-semibold text-white">{img.title}</p>
                      </div>
                    )}

                    {/* Border Glow */}
                    <div className="absolute inset-0 rounded-lg border border-primary/0 group-hover/img:border-primary/30 transition-all duration-500" />
                  </div>
                ))}
              </div>
            )}

            {/* View Collection Button */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={onViewCollection}
                className="group/btn flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 font-semibold"
              >
                View Collection
                <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
