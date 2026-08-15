import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCw } from "lucide-react";

interface PremiumVideoPlayerProps {
  src: string;
  title?: string;
  description?: string;
  className?: string;
}

export const PremiumVideoPlayer = ({
  src,
  title,
  description,
  className = "",
}: PremiumVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [rotation, setRotation] = useState(0);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * videoRef.current.duration;
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    return () => clearTimeout(controlsTimeoutRef.current);
  }, []);

  return (
    <div
      className={`group relative w-full rounded-2xl overflow-hidden bg-black ${className}`}
      style={{
        aspectRatio: "16 / 9",
        boxShadow: "0 20px 70px rgba(201, 169, 97, 0.18)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowControls(false);
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Video Container with Rotation */}
      <div
        className="w-full h-full transition-transform duration-500 ease-out flex items-center justify-center"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      </div>

      {/* Large Animated Play Button Overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isPlaying ? "opacity-0" : "opacity-100"
        }`}
        onClick={handlePlayPause}
      >
        <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-2 border-white/30 hover:border-white/50 transition-all duration-300 cursor-pointer group/play hover:scale-110 hover:bg-white/20">
          <Play className="w-10 h-10 text-white fill-white ml-1" />
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-6 transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress Bar */}
        <div
          className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-4 hover:h-2 transition-all duration-200 group/progress"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-300 rounded-full transition-all duration-100 group-hover/progress:shadow-lg group-hover/progress:shadow-amber-400/50"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Control Bar */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayPause}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>
            <span className="text-sm font-light">
              {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
            </span>
          </div>
          <button
            onClick={handleRotate}
            className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
            aria-label="Rotate video 90 degrees clockwise"
            title={`Rotate (${rotation}°)`}
          >
            <RotateCw className="w-5 h-5" style={{ transform: `rotate(${rotation}deg)` }} />
          </button>
        </div>
      </div>

      {/* Title & Description */}
      {(title || description) && (
        <div className="absolute top-0 left-0 right-0 p-6 pointer-events-none">
          {title && (
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-white/80 text-sm md:text-base max-w-md">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Hover Scale Effect */}
      {isHovered && (
        <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none" />
      )}
    </div>
  );
};
