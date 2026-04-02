"use client";

import { BadgeCheck, Cloud, Shield } from "lucide-react";

export function EstabelecimentoGeralTrustFooter() {
  return (
    <footer className="text-muted-foreground/60 flex flex-wrap items-center justify-center gap-5 border-t border-border/60 py-4 text-[9px] font-medium uppercase tracking-tight sm:gap-6 sm:text-[10px]">
      <div className="flex items-center gap-1.5">
        <BadgeCheck className="size-3.5" />
        <span>Certificado digital</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Shield className="size-3.5" />
        <span>Dados protegidos</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Cloud className="size-3.5" />
        <span>Sincronizado</span>
      </div>
    </footer>
  );
}
