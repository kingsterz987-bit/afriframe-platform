import React from "react";
import { cn } from "@/lib/utils";

/**
 * Glassy card with an animated gradient blob travelling along its border.
 * Purely presentational — wrap any content.
 */
const GradientBlobCard = ({
  children,
  className,
  contentClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) => (
  <div className={cn("relative overflow-hidden rounded-[26px] p-[1.5px]", className)}>
    {/* Animated gradient blob (border light) */}
    <div
      aria-hidden
      className="animate-blob pointer-events-none absolute left-1/2 top-1/2 h-[200%] w-[200%] rounded-full opacity-70 blur-[36px]"
      style={{
        background:
          "conic-gradient(from 0deg, hsl(var(--gold)), hsl(var(--gold)/0.15), hsl(38 92% 62%), hsl(var(--gold)/0.1), hsl(var(--gold)))",
      }}
    />
    {/* Glassy background */}
    <div
      className={cn(
        "relative rounded-[24px] border border-border/60 bg-card/80 backdrop-blur-xl",
        contentClassName,
      )}
    >
      {children}
    </div>
  </div>
);

export default GradientBlobCard;
