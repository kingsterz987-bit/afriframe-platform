import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumVideoPlayer } from "@/components/ui/premium-video-player";
import { CollectionSection } from "@/components/portfolio/collection-section";
import { CategoryFilters } from "@/components/portfolio/category-filters";
import { VideoCollectionGrid } from "@/components/portfolio/video-collection-grid";
import { CollectionDetailModal } from "@/components/portfolio/collection-detail-modal";

// New provided images - using blob URLs
const familyPortrait = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imgi_18_491439725_18497317444016923_86191005857537098_n-WcTN2AcOJwfT2TnRJ3ArnYbWMOJraB.jpg";
const turquoiseGown = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imgi_6_463119922_18461666416016923_2214342906593189758_n-4Ibq4gqiOWh4snUlfgOWLjsEsJK5Ko.jpg";
const chefWhisk = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/482550348_18488340502016923_4794447291881132350_n-0CBJXcrQv6ErgGVEIOoDtfNSWMHRLX.jpg";
const businessWoman = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/724118718_18593416486039347_3939844573745523097_n-piBh2WaIMducTHHWAXTgnlXWXNiXpo.jpg";
const womensDayPoster = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/483347684_18489053758016923_3319694039426042132_n-7otDCX9yRC84et3vu9SmUwAY6dWlWz.jpg";
const beautyPortrait = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/487446290_18048925673346357_5977272209636599575_n-941qFGvrgcGZsNG3CJLoWVl5jTT6RC.jpg";
const fashionHat = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imgi_6_501275842_18163243663354922_8740217587413443462_n-kJhMqSmAzVE4LwquvunWAkNbZV11l9.jpg";
const goldenDress = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imgi_7_499783517_18504152398016923_8467541026508541721_n-mCo6GmrikLfFeEjKbV589KicBgtOCl.jpg";
const businessPortrait = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imgi_15_491433096_17857029396410148_2136071068476210401_n-yM53LdeBpJOZIbkx3ljooLRzptuTjR.jpg";
const weddingBlackWhite = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/499378474_18502959112016923_4222189175650082913_n-AT8T7MrFalC8V3yUvivUNCLcsX9yGj.jpg";

// Video URLs - blob storage
const videoWedding1 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AQPMZ4lj-H41A0eLEuSObZtqiQvWkEzdrDLhaoKyHZcyI4RS62wNV3z7goCb600n6MDF4ABMiwn1p2SjsFv-WEXQ-WsawCAI1pSvjsZyGUjveUiVEpOBZ6u.mp4";
const videoFashion1 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AQOmEPRv6L07uuSf8D0cUlz2iBGVlGVAnRYLA_06zBEy6kfoq3-qQkxdVJD8Vl-iaVWUKEhRhP5BTft5-MhHUW00EOrvDwd_5qQfqUY-YR5hBfFMduIRHR6pxXGACnZk5TLoZ8.mp4";
const videoCommercial = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AQOgPpyddwiFHKAh0RgZ4ywXaD8f2RGv3lx8tPgzUyoylemo7Y5j9-NcU-6zJvnVyRO8Fqq9zu6Ewi9gDqfcnKoMhBgMfKtEvuegTR0-zdRjsi6XP0A09ZAdShWWYDzAweAMks.mp4";
const videoFashion2 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AQNIrmvvVpipCYQw468BnT7zz9unvvTm63j-3pI3Z38i3biZLiiavN4ubNNi7UQpJG0fLvzMHMVtzhPri6Q3ZXOD9WeCxVHg7pZCh-I-0z25MXCrWbYWtR9iAQcP0SZ8EbolAJ.mp4";
const videoPortrait = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AQPa0ofiy5wh9oo8aL0dIVPl0vAs4jIAQoSZgyRnVOTrNp3bgt47pl4W4KTyCj9jCpKkGWGQ3e3VbnTbqYjNGfpPpQtbp1ygsdyOf-U-41d3JeIjzeiKa4AC2AUZx391230tM8.mp4";
const videoEditorial = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AQOm_ZOWimVwXYaMk7MKNV15uxNkJ2_oKHXsQl4ILhhJaDUjSonnTSnn8PoomYwoH8-3O3rmhBA8DJ4NlHgi_s3hU-dbWjjp8HmPAJg-ewuXNc6LjckrvA6PvAKnqlm2xFql0I.mp4";

// Old fallback imports
import weddingOutdoor from "@/assets/wedding-outdoor.jpg";
import weddingIndoor from "@/assets/wedding-indoor.jpg";

// Curated collections with supporting images
const curatedCollections = [
  {
    title: "Weddings & Love Stories",
    category: "Weddings",
    description: "Timeless moments of love and celebration captured with cinematic precision. From intimate ceremonies to grand celebrations, we document the stories that matter most.",
    frameCount: 58,
    featuredImage: weddingBlackWhite,
    supportingImages: [
      { src: familyPortrait, title: "Family Moments", size: "large" as const },
      { src: weddingOutdoor, title: "Golden Hour", size: "small" as const },
      { src: weddingIndoor, title: "Elegant Reception", size: "small" as const },
    ],
    allImages: [weddingBlackWhite, familyPortrait, weddingOutdoor, weddingIndoor],
  },
  {
    title: "Fashion & Editorial",
    category: "Fashion",
    description: "Bold, artistic, and captivating fashion photography that celebrates style and personality. Our editorial work pushes creative boundaries with stunning visuals.",
    frameCount: 67,
    featuredImage: turquoiseGown,
    supportingImages: [
      { src: fashionHat, title: "Bold Vision", size: "large" as const },
      { src: businessWoman, title: "Professional Elegance", size: "small" as const },
      { src: goldenDress, title: "Luxury Details", size: "small" as const },
    ],
    allImages: [turquoiseGown, fashionHat, businessWoman, goldenDress],
  },
  {
    title: "Lifestyle & Portraits",
    category: "Lifestyle",
    description: "Authentic moments that reveal the essence of life. From personal milestones to everyday beauty, we capture what makes each person uniquely themselves.",
    frameCount: 52,
    featuredImage: beautyPortrait,
    supportingImages: [
      { src: chefWhisk, title: "Professional Pride", size: "medium" as const },
      { src: businessPortrait, title: "Corporate Essence", size: "small" as const },
      { src: womensDayPoster, title: "Campaign Moments", size: "small" as const },
    ],
    allImages: [beautyPortrait, chefWhisk, businessPortrait, womensDayPoster],
  },
];

const videoCollections = [
  { id: 1, src: videoWedding1, title: "Timeless Love Stories", category: "Weddings", description: "Cinematic wedding films that capture emotion and grace" },
  { id: 2, src: videoFashion1, title: "Fashion in Motion", category: "Fashion", description: "Dynamic editorial videography that brings style to life" },
  { id: 3, src: videoCommercial, title: "Brand Narratives", category: "Commercial", description: "Commercial storytelling that resonates and inspires" },
  { id: 4, src: videoFashion2, title: "Editorial Elegance", category: "Fashion", description: "High-fashion cinematography with artistic vision" },
  { id: 5, src: videoPortrait, title: "Portrait Stories", category: "Lifestyle", description: "Personal moments captured in cinematic detail" },
  { id: 6, src: videoEditorial, title: "Creative Vision", category: "Editorial", description: "Artistic storytelling through motion and light" },
];

const Explore = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  const filteredCollections = 
    activeCategory === "All"
      ? curatedCollections
      : curatedCollections.filter(c => c.category === activeCategory);

  const categories = [...new Set(curatedCollections.map(c => c.category))];

  const handleViewCollection = (collection: any) => {
    setSelectedCollection({
      ...collection,
      images: collection.allImages,
    });
  };

  const handleSelectVideo = (video: any) => {
    setSelectedVideo(video);
    setShowVideoPlayer(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Editorial Hero Section */}
      <section className="py-32 md:py-48 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <span className="eyebrow mb-6 block">Portfolio</span>
            <h1 className="display mb-8">Explore Our Creative Work</h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 max-w-3xl mx-auto">
              A curated collection of our finest cinematic moments. From intimate celebrations to bold editorial visions, each frame is a testament to our craft.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  const element = document.getElementById("collections");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 font-semibold flex items-center justify-center gap-2 group"
              >
                View All Collections
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
              <Link to="/booking">
                <button className="px-8 py-4 border border-primary/30 text-foreground rounded-full hover:bg-primary/10 transition-all duration-300 font-semibold">
                  Start Your Project
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section - Photo Collections First */}
      <section id="collections" className="py-12">
        <div className="container mx-auto px-4">
          {/* Category Filters */}
          <div className="mb-24 animate-fade-in">
            <CategoryFilters
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              className="mb-16"
            />
          </div>

          {/* Curated Collections */}
          <div className="space-y-0">
            {filteredCollections.map((collection, index) => (
              <CollectionSection
                key={collection.title}
                title={collection.title}
                category={collection.category}
                description={collection.description}
                frameCount={collection.frameCount}
                featuredImage={collection.featuredImage}
                supportingImages={collection.supportingImages}
                onViewCollection={() => handleViewCollection(collection)}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Premium Video Showreel - Videos After Collections */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-12 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <span className="eyebrow mb-4 block">Featured Showreel</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Cinematic Excellence</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Experience our videography at its finest. A celebration of motion, emotion, and storytelling.
            </p>
          </div>

          {/* Premium Video Player */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <PremiumVideoPlayer
              src={videoCollections[0].src}
              title={videoCollections[0].title}
              description={videoCollections[0].description}
              className="max-w-5xl mx-auto"
            />
          </div>

          {/* Additional Featured Videos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {videoCollections.slice(1, 3).map((video, index) => (
              <div
                key={video.id}
                className="group rounded-2xl overflow-hidden animate-fade-in cursor-pointer"
                style={{ 
                  aspectRatio: "16/9",
                  animationDelay: `${0.3 + (index + 1) * 0.1}s` 
                }}
                onClick={() => handleSelectVideo(video)}
              >
                <div className="relative w-full h-full">
                  <video
                    src={video.src}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent group-hover:from-background/90 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold mb-2">{video.title}</h3>
                    <p className="text-muted-foreground">{video.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Collections Grid */}
      <VideoCollectionGrid
        videos={videoCollections}
        onSelectVideo={handleSelectVideo}
        title="All Video Collections"
        subtitle="Browse our complete collection of cinematic videography across all categories"
      />

      {/* Collection Detail Modal */}
      {selectedCollection && (
        <CollectionDetailModal
          isOpen={!!selectedCollection}
          onClose={() => setSelectedCollection(null)}
          collection={selectedCollection}
        />
      )}

      {/* Video Player Modal */}
      {showVideoPlayer && selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md animate-fade-in"
          onClick={() => {
            setShowVideoPlayer(false);
            setSelectedVideo(null);
          }}
        >
          <div
            className="relative max-w-2xl w-[90vw] md:w-[70vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowVideoPlayer(false);
                setSelectedVideo(null);
              }}
              className="absolute -top-12 right-0 text-muted-foreground hover:text-foreground transition-colors z-10 text-xl font-bold"
            >
              ✕
            </button>
            <div
              className="rounded-2xl overflow-hidden shadow-2xl shadow-primary/30"
              style={{ aspectRatio: "16/9" }}
            >
              <video
                src={selectedVideo.src}
                className="w-full h-full object-cover"
                autoPlay
                controls
                playsInline
              />
            </div>
            <div className="mt-6 p-6 bg-secondary/50 rounded-xl">
              <h3 className="text-2xl font-bold mb-2">{selectedVideo.title}</h3>
              <p className="text-muted-foreground mb-2">{selectedVideo.description}</p>
              <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold">
                {selectedVideo.category}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Section */}
      <section className="py-24 md:py-32 bg-secondary/50 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { number: "500+", label: "Projects Delivered" },
              { number: "12+", label: "Years of Excellence" },
              { number: "98%", label: "Client Satisfaction" },
              { number: "25+", label: "Awards & Recognition" },
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <p className="text-muted-foreground text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 md:py-48 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="display mb-8">Ready to Create Something Extraordinary?</h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Let's collaborate to bring your vision to life with cinematic excellence and artistic vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full">
                  Book a Session
                </Button>
              </Link>
              <Link to="/#contact">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full border-primary/30 hover:bg-primary/10">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Afriframe Pictures. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Explore;
