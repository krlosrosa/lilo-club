"use client";

import type { Dispatch, SetStateAction } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { Info, Map, MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { UFS } from "../../constants";
import type { EnderecoFields } from "../../types";

const ufsList = UFS as unknown as string[];

export interface EnderecoFormCardProps {
  f: EnderecoFields;
  setOverrides: Dispatch<SetStateAction<Partial<EnderecoFields>>>;
  onBuscarCep: () => void | Promise<void>;
  saveM: UseMutationResult<unknown, Error, void, unknown>;
}

export function EnderecoFormCard({ f, setOverrides, onBuscarCep, saveM }: EnderecoFormCardProps) {
  return (
    <>
      <div className="bg-card rounded-lg p-6 shadow-sm sm:p-8">
        <h2 className="text-primary mb-6 text-lg font-semibold">Dados de endereço</h2>
        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="cep" className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              CEP
            </Label>
            <div className="flex gap-2">
              <div className="group relative min-w-0 flex-1">
                <MapPin className="text-muted-foreground group-focus-within:text-primary pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
                <Input
                  id="cep"
                  className="bg-muted/50 h-12 rounded-xl border-0 pl-11 shadow-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  placeholder="00000-000"
                  value={f.cep}
                  onChange={(e) => setOverrides((o) => ({ ...o, cep: e.target.value }))}
                />
              </div>
              <Button type="button" variant="secondary" className="h-12 shrink-0 rounded-xl" onClick={onBuscarCep}>
                Buscar
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="log" className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Rua / logradouro
            </Label>
            <div className="group relative">
              <Map className="text-muted-foreground group-focus-within:text-primary pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
              <Input
                id="log"
                className="bg-muted/50 h-12 rounded-xl border-0 pl-11 shadow-none focus-visible:ring-2 focus-visible:ring-primary/20"
                placeholder="Rua e número"
                value={f.logradouro}
                onChange={(e) => setOverrides((o) => ({ ...o, logradouro: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="bairro" className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Bairro
              </Label>
              <Input
                id="bairro"
                className="bg-muted/50 h-12 rounded-xl border-0 shadow-none focus-visible:ring-2 focus-visible:ring-primary/20"
                value={f.bairro}
                onChange={(e) => setOverrides((o) => ({ ...o, bairro: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cid" className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Cidade
              </Label>
              <Input
                id="cid"
                className="bg-muted/50 h-12 rounded-xl border-0 shadow-none focus-visible:ring-2 focus-visible:ring-primary/20"
                value={f.cidade}
                onChange={(e) => setOverrides((o) => ({ ...o, cidade: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="uf" className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Estado
            </Label>
            <select
              id="uf"
              className="border-input bg-muted/50 h-12 w-full rounded-xl border-0 px-4 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none"
              value={f.uf}
              onChange={(e) => setOverrides((o) => ({ ...o, uf: e.target.value }))}
            >
              {ufsList.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <Button
              type="button"
              variant="secondary"
              className="h-12 w-full gap-2 rounded-xl font-bold"
              onClick={() => saveM.mutate()}
              disabled={saveM.isPending}
            >
              <RefreshCw className={cn("size-4", saveM.isPending && "animate-spin")} />
              {saveM.isPending ? "Salvando…" : "Atualizar localização"}
            </Button>
          </div>
        </div>
      </div>

      <div className="border-primary/15 bg-primary/5 flex gap-4 rounded-lg border p-6">
        <div className="bg-primary text-primary-foreground flex size-12 shrink-0 items-center justify-center rounded-full">
          <Info className="size-5" />
        </div>
        <div>
          <p className="text-primary mb-1 text-sm font-semibold">Dica de curadoria</p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Verifique se o marcador no mapa ao lado está exatamente sobre a entrada principal do seu
            estabelecimento para facilitar o GPS.
          </p>
        </div>
      </div>
    </>
  );
}
