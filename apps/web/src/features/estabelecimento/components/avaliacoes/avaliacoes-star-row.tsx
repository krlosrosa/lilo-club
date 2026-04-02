"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AvaliacoesStarRowProps {
  nota: number;
  size?: "default" | "large";
}

export function AvaliacoesStarRow({ nota, size = "default" }: AvaliacoesStarRowProps) {
  const iconClass = size === "large" ? "size-7 sm:size-8" : "size-5 sm:size-6";
  return (
    <div className="flex text-amber-500">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(iconClass, i <= nota ? "fill-amber-400 text-amber-400" : "text-muted-foreground/25")}
          aria-hidden
        />
      ))}
    </div>
  );
}
