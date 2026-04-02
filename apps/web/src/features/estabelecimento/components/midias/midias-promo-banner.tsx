"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function MidiasPromoBanner() {
  return (
    <div className="bg-primary relative overflow-hidden rounded-lg shadow-xl">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      </div>
      <div className="relative flex flex-col items-center justify-between gap-8 p-10 md:flex-row">
        <div className="text-primary-foreground text-center md:text-left">
          <h4 className="mb-2 text-3xl font-extrabold tracking-tight">Destaque sua marca</h4>
          <p className="max-w-lg text-sm opacity-90">
            Sua mídia é o espelho do seu negócio. Imagens profissionais aumentam a taxa de conversão em até 45%.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="rounded-full px-10 font-extrabold shadow-lg"
          onClick={() => toast.message("Em breve: parceria com fotógrafos.")}
        >
          Solicitar fotógrafo pro
        </Button>
      </div>
    </div>
  );
}
