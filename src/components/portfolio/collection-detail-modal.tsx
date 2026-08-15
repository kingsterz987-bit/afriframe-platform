import { X } from "lucide-react";
import { useEffect } from "react";

interface CollectionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: {
    title: string;
    description: string;
    frameCount: number;
    category: string;
    images: string[];
  };
}

export function CollectionDetailModal({
  isOpen,
  onClose,
  collection,
}: CollectionDetailModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-[90vw] max-h-[90vh] overflow-y-auto rounded-2xl bg-background border border-primary/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-4 right-4 z-10 p-2 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all ml-auto block"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Content */}
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="mb-12">
            <span className="inline-block text-primary text-sm font-semibold tracking-widest uppercase mb-4">
              {collection.category}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {collection.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-xl">
              {collection.description}
            </p>
            <div className="flex gap-6">
              <div>
                <div className="text-3xl font-bold text-primary">
                  {collection.frameCount}+
                </div>
                <p className="text-muted-foreground text-sm">Frames Captured</p>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collection.images.map((image, index) => (
              <div
                key={index}
                className="group rounded-xl overflow-hidden aspect-square md:aspect-auto"
              >
                <img
                  src={image}
                  alt={`${collection.title} - Image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <p className="text-muted-foreground mb-6">
              Interested in creating your own collection?
            </p>
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all font-semibold">
              Start Your Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
