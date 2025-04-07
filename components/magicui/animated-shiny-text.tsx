"use client"

import { ComponentPropsWithoutRef, CSSProperties, FC, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface AnimatedShinyTextProps
  extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    let startTime: number | null = null;
    const duration = 3000; // 3 seconds for one full animation cycle

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;

      // Calculate position from 0 to 200% (to move completely across and back)
      const newPosition = progress * 200;
      setPosition(newPosition);

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <span
      ref={spanRef}
      style={
        {
          "--shiny-width": `${shimmerWidth}px`,
          backgroundPosition: `${position}% 0`,
        } as CSSProperties
      }
      className={cn(
        "mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70",

        // Shine effect (using standard classes instead of custom animation)
        "bg-clip-text bg-no-repeat transition-all duration-300 ease-in-out",
        "bg-[length:var(--shiny-width)_100%]",

        // Shine gradient
        "bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent dark:via-white/80",

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
