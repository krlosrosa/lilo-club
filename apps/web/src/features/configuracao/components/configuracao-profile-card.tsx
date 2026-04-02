"use client";

import type { RefObject } from "react";
import type { AuthMeResponse } from "@lilo-hub/contracts";
import { Calendar, Camera, Pencil, UserCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { badgeLabelConfig, membroDesdeFmt, TIPOS_USUARIO } from "../utils/configuracao";

export interface ConfiguracaoProfileCardProps {
  me: AuthMeResponse;
  displayName: string;
  tipo: "cliente" | "dono" | "parceiro" | null;
  setTipo: (v: "cliente" | "dono" | "parceiro" | null) => void;
  dadosRef: RefObject<HTMLDivElement | null>;
}

export function ConfiguracaoProfileCard({
  me,
  displayName,
  tipo,
  setTipo,
  dadosRef,
}: ConfiguracaoProfileCardProps) {
  return (
    <div className="bg-card border-border relative overflow-hidden rounded-xl border p-8 shadow-sm">
      <div className="bg-primary/5 pointer-events-none absolute -top-12 -right-12 size-48 rounded-full blur-3xl" />
      <div className="relative z-10 flex flex-col items-start gap-8 md:flex-row">
        <div className="relative shrink-0">
          <div className="ring-background size-32 overflow-hidden rounded-2xl ring-4 shadow-lg md:size-40">
            {me.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={me.avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              <div className="bg-muted flex size-full items-center justify-center">
                <UserCircle2 className="text-muted-foreground size-16 md:size-20" />
              </div>
            )}
          </div>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute -right-2 -bottom-2 size-11 rounded-xl shadow-lg"
            onClick={() => toast.message("Upload de foto em breve.")}
          >
            <Camera className="size-5" />
          </Button>
        </div>

        <div className="min-w-0 flex-1 space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-3">
                <h2 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">{displayName}</h2>
                <span className="bg-secondary/25 text-secondary-foreground rounded px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                  {badgeLabelConfig(me)}
                </span>
              </div>
              <p className="text-muted-foreground">{me.email}</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="gap-2 rounded-full font-bold"
              onClick={() => dadosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              <Pencil className="size-4" />
              Editar perfil
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="bg-muted/50 rounded-lg p-4">
              <span className="text-muted-foreground mb-3 block text-xs font-bold uppercase tracking-wider">
                Tipo de usuário
              </span>
              <div className="flex flex-wrap gap-4">
                {TIPOS_USUARIO.map((opt) => (
                  <label key={opt.value} className="group flex cursor-pointer items-center gap-2">
                    <div className="relative flex size-5 items-center justify-center">
                      <input
                        type="radio"
                        name="tipo_usuario"
                        className="peer size-5 cursor-pointer appearance-none rounded-full border-2 border-muted-foreground/40 checked:border-primary"
                        checked={tipo === opt.value}
                        onChange={() => setTipo(opt.value)}
                      />
                      <div className="bg-primary pointer-events-none absolute size-2.5 scale-0 rounded-full transition-transform peer-checked:scale-100" />
                    </div>
                    <span className="text-muted-foreground group-hover:text-foreground text-sm font-medium">
                      {opt.label.toLowerCase()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <span className="text-muted-foreground mb-1 block text-xs font-bold uppercase tracking-wider">
                Membro desde
              </span>
              <span className="text-foreground flex items-center gap-2 font-semibold capitalize">
                <Calendar className="text-primary size-4 shrink-0" />
                {membroDesdeFmt(me.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
