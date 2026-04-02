"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { AvaliacaoItem } from "../../utils/avaliacoes";

export interface AvaliacoesReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeAvaliacao: AvaliacaoItem | null;
  replyText: string;
  setReplyText: (v: string) => void;
  isPending: boolean;
  onSubmit: () => void;
}

export function AvaliacoesReplyDialog({
  open,
  onOpenChange,
  activeAvaliacao,
  replyText,
  setReplyText,
  isPending,
  onSubmit,
}: AvaliacoesReplyDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {activeAvaliacao?.resposta?.trim() ? "Editar resposta" : "Responder avaliação"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="rep">Sua mensagem ao cliente</Label>
          <textarea
            id="rep"
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[120px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Ex.: Obrigado pelo feedback…"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" disabled={!activeAvaliacao || !replyText.trim() || isPending} onClick={onSubmit}>
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
