"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface EstabelecimentoDescricaoIaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestedText: string;
  onApply: () => void;
}

export function EstabelecimentoDescricaoIaDialog({
  open,
  onOpenChange,
  suggestedText,
  onApply,
}: EstabelecimentoDescricaoIaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Sugestão da IA</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Revise o texto abaixo. Ao confirmar, ele substitui a descrição no formulário — use
          &quot;Salvar alterações&quot; para gravar no guia.
        </p>
        <div
          className="bg-muted/60 max-h-[min(50vh,320px)] overflow-y-auto rounded-lg p-3 text-sm whitespace-pre-wrap sm:p-4"
          role="region"
          aria-label="Texto sugerido pela IA"
        >
          {suggestedText}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => {
              onApply();
              onOpenChange(false);
            }}
          >
            Usar esta descrição
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
