"use client";

import type { RefObject } from "react";
import type { AuthMeResponse } from "@lilo-hub/contracts";
import { BadgeCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ConfiguracaoDadosSectionProps {
  dadosRef: RefObject<HTMLDivElement | null>;
  me: AuthMeResponse;
  nome: string;
  setNome: (v: string) => void;
}

export function ConfiguracaoDadosSection({ dadosRef, me, nome, setNome }: ConfiguracaoDadosSectionProps) {
  const telefoneFmt = me.telefone?.trim() || "Não informado";

  return (
    <div ref={dadosRef} className="bg-card border-border rounded-xl border p-8 shadow-sm">
      <div className="mb-8 flex items-center gap-4">
        <div className="bg-primary/15 flex size-10 items-center justify-center rounded-lg">
          <BadgeCheck className="text-primary size-5" />
        </div>
        <h3 className="text-xl font-bold tracking-tight">Dados profissionais</h3>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nome_completo" className="text-muted-foreground ml-1 text-sm font-semibold">
              Nome completo
            </Label>
            <Input
              id="nome_completo"
              className="h-12 rounded-lg"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email_principal" className="text-muted-foreground ml-1 text-sm font-semibold">
              E-mail principal
            </Label>
            <Input
              id="email_principal"
              type="email"
              className="bg-muted/80 h-12 cursor-not-allowed rounded-lg opacity-90"
              value={me.email}
              disabled
              readOnly
            />
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label className="text-muted-foreground ml-1 text-sm font-semibold">Telefone celular</Label>
            <div className="bg-muted/60 text-muted-foreground h-12 rounded-lg px-4 py-3 text-sm font-medium">
              {telefoneFmt}
            </div>
            <p className="text-muted-foreground text-xs">Alteração de telefone mediante suporte.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
