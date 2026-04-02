"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface CatalogCidadeRow {
  id: string;
  nome: string;
  uf: string;
}

export interface CatalogCategoriaRow {
  id: string;
  nome: string;
}

export interface CreateEstabelecimentoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nome: string;
  setNome: (v: string) => void;
  cidadeId: string;
  setCidadeId: (v: string) => void;
  categoriaId: string;
  setCategoriaId: (v: string) => void;
  cidades: CatalogCidadeRow[];
  categorias: CatalogCategoriaRow[];
  isCreating: boolean;
  onSubmit: () => void;
}

export function CreateEstabelecimentoDialog({
  open,
  onOpenChange,
  nome,
  setNome,
  cidadeId,
  setCidadeId,
  categoriaId,
  setCategoriaId,
  cidades,
  categorias,
  isCreating,
  onSubmit,
}: CreateEstabelecimentoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo estabelecimento</DialogTitle>
          <DialogDescription>
            Informe os dados iniciais. Você poderá completar os detalhes depois.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do estabelecimento"
            />
          </div>
          <div className="space-y-2">
            <Label>Cidade</Label>
            <select
              className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
              value={cidadeId}
              onChange={(e) => setCidadeId(e.target.value)}
            >
              <option value="">Selecione…</option>
              {cidades.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome} ({c.uf})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Categoria</Label>
            <select
              className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
            >
              <option value="">Selecione…</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" disabled={isCreating} onClick={onSubmit}>
            {isCreating ? "Salvando…" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
