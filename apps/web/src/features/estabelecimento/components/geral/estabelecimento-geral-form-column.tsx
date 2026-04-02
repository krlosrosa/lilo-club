"use client";

import { HelpCircle, Save, Sparkles, Store, Tag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CategoriaOption } from "../../types";

export interface EstabelecimentoGeralFormColumnProps {
  nome: string;
  setNome: (v: string) => void;
  descricao: string;
  setDescricao: (v: string) => void;
  conteudoSemantico: string;
  setSemantico: (v: string) => void;
  pesoDestaque: number;
  setPesoDestaque: (v: number) => void;
  categoriaId: string;
  setCategoriaId: (v: string) => void;
  categorias: CategoriaOption[];
  onSave: () => void;
  isSaving: boolean;
  onSuggestDescricao: () => void;
  isSuggestingDescricao: boolean;
}

export function EstabelecimentoGeralFormColumn({
  nome,
  setNome,
  descricao,
  setDescricao,
  conteudoSemantico,
  setSemantico,
  pesoDestaque,
  setPesoDestaque,
  categoriaId,
  setCategoriaId,
  categorias,
  onSave,
  isSaving,
  onSuggestDescricao,
  isSuggestingDescricao,
}: EstabelecimentoGeralFormColumnProps) {
  return (
    <div className="space-y-5 lg:col-span-8">
      <section className="bg-card rounded-xl border border-border/60 p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-2 sm:mb-6">
          <div className="bg-primary/70 h-5 w-1 rounded-full" />
          <h2 className="text-base font-semibold sm:text-lg">Informações básicas</h2>
        </div>
        <div className="space-y-5 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-muted-foreground ml-0.5 text-xs font-medium sm:text-sm">
              Nome do estabelecimento
            </Label>
            <div className="relative">
              <Store className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                id="nome"
                className="focus-visible:ring-primary/20 h-11 rounded-lg border-0 bg-muted/60 pl-10 text-sm shadow-none focus-visible:ring-2"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="cat" className="text-muted-foreground ml-0.5 text-xs font-medium sm:text-sm">
                Categoria
              </Label>
              <div className="relative">
                <Tag className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2" />
                <select
                  id="cat"
                  className="border-input bg-muted/60 h-11 w-full appearance-none rounded-lg border-0 pl-10 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                >
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
                <span className="text-muted-foreground pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                  ▼
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="ml-0.5 flex items-center gap-1.5">
                <Label htmlFor="peso" className="text-muted-foreground text-xs font-medium sm:text-sm">
                  Peso de destaque
                </Label>
                <span title="Define a prioridade de exibição nas buscas. Valores maiores aparecem primeiro.">
                  <HelpCircle className="text-muted-foreground size-3.5 cursor-help sm:size-4" />
                </span>
              </div>
              <div className="relative">
                <TrendingUp className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  id="peso"
                  type="number"
                  className="focus-visible:ring-primary/20 h-11 rounded-lg border-0 bg-muted/60 pl-10 text-sm shadow-none focus-visible:ring-2"
                  value={pesoDestaque}
                  onChange={(e) => setPesoDestaque(Number(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="ml-0.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Label htmlFor="desc" className="text-muted-foreground text-xs font-medium sm:text-sm">
                Descrição editorial
              </Label>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-9 shrink-0 gap-1.5 rounded-full px-3 text-xs sm:h-8"
                disabled={!descricao.trim() || isSuggestingDescricao}
                onClick={onSuggestDescricao}
              >
                <Sparkles className="size-3.5" />
                {isSuggestingDescricao ? "Gerando…" : "Melhorar com IA"}
              </Button>
            </div>
            <textarea
              id="desc"
              className="focus:ring-primary/20 min-h-[120px] w-full resize-none rounded-lg border-0 bg-muted/60 p-3 text-sm shadow-none focus:outline-none focus:ring-2 sm:min-h-[140px] sm:p-4"
              placeholder="Conte a história do seu negócio…"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="bg-card rounded-xl border border-border/60 p-5 shadow-sm sm:p-6">
        <div className="mb-2 flex items-center gap-2">
          <div className="bg-primary/70 h-5 w-1 rounded-full" />
          <h2 className="text-base font-semibold sm:text-lg">Conteúdo para consulta semântica</h2>
        </div>
        <p className="text-muted-foreground mb-4 ml-0.5 text-xs sm:mb-5 sm:text-sm">
          Este texto será processado para melhorar a busca inteligente do seu estabelecimento.
        </p>
        <textarea
          className="focus:ring-primary/20 min-h-[160px] w-full resize-none rounded-lg border-0 bg-muted/60 p-3 text-sm shadow-none focus:outline-none focus:ring-2 sm:min-h-[180px] sm:p-4"
          id="semantic-content"
          placeholder="Cole aqui informações detalhadas, menus, diferenciais ou qualquer texto relevante para a busca inteligente…"
          value={conteudoSemantico}
          onChange={(e) => setSemantico(e.target.value)}
        />
      </section>

      <div className="flex justify-end pt-1">
        <Button
          className="h-11 gap-2 rounded-full px-8 text-sm font-medium shadow-sm sm:px-10"
          onClick={onSave}
          disabled={isSaving}
        >
          <Save className="size-4" />
          {isSaving ? "Salvando…" : "Salvar alterações"}
        </Button>
      </div>
    </div>
  );
}
