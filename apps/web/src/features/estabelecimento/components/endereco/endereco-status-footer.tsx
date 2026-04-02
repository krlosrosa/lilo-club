"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export interface EnderecoStatusFooterProps {
  estabelecimentoId: string;
  atualizadoTxt: string | null;
  onDescartar: () => void;
}

export function EnderecoStatusFooter({ estabelecimentoId, atualizadoTxt, onDescartar }: EnderecoStatusFooterProps) {
  return (
    <div className="bg-muted/80 rounded-full p-1">
      <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3">
          <span className="relative flex size-3">
            <span className="bg-primary absolute inline-flex size-full animate-ping rounded-full opacity-75" />
            <span className="bg-primary relative inline-flex size-3 rounded-full" />
          </span>
          <p className="text-muted-foreground text-sm font-medium">
            {atualizadoTxt
              ? `Última atualização: ${atualizadoTxt}`
              : "Ainda não há registro de atualização deste endereço."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <Button
            type="button"
            variant="ghost"
            className="text-muted-foreground font-bold hover:text-foreground"
            onClick={() => {
              onDescartar();
              toast.message("Alterações descartadas.");
            }}
          >
            Descartar
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="rounded-full font-bold shadow-sm"
            onClick={() => toast.message("Histórico em breve.")}
          >
            Revisar histórico
          </Button>
          <Button type="button" variant="outline" className="rounded-full font-bold" asChild>
            <Link href={`/estabelecimentos/${estabelecimentoId}`}>Voltar às informações</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
