"use client";

import { queryKeys } from "@lilo-hub/clients";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Plus, SearchX } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreateEstabelecimentoDialog,
  type CatalogCategoriaRow,
  type CatalogCidadeRow,
} from "../components/lista/create-estabelecimento-dialog";
import { estabelecimentoApi } from "../api";

export function EstabelecimentosListScreen() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const debouncedSearch = useMemo(() => search.trim() || undefined, [search]);

  const listQ = useQuery({
    queryKey: queryKeys.estabelecimentos(debouncedSearch),
    queryFn: () => estabelecimentoApi.listEstabelecimentos(debouncedSearch),
  });

  const cidadeQ = useQuery({
    queryKey: queryKeys.catalogCidades,
    queryFn: () => estabelecimentoApi.getCatalogCidades(),
  });

  const categoriaQ = useQuery({
    queryKey: queryKeys.catalogCategorias,
    queryFn: () => estabelecimentoApi.getCatalogCategorias(),
  });

  const createM = useMutation({
    mutationFn: estabelecimentoApi.createEstabelecimento.bind(estabelecimentoApi),
    onSuccess: () => {
      toast.success("Estabelecimento criado");
      void queryClient.invalidateQueries({ queryKey: ["estabelecimentos"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [cidadeId, setCidadeId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  const items = listQ.data?.items ?? [];
  const isTrueEmpty = items.length === 0 && !debouncedSearch;
  const isSearchEmpty = items.length === 0 && Boolean(debouncedSearch);

  const cidades: CatalogCidadeRow[] = (cidadeQ.data?.items ?? []).map((c) => ({
    id: c.id,
    nome: c.nome,
    uf: c.uf,
  }));
  const categorias: CatalogCategoriaRow[] = (categoriaQ.data?.items ?? []).map((c) => ({
    id: c.id,
    nome: c.nome,
  }));

  function submitCreate() {
    if (!nome.trim() || !cidadeId || !categoriaId) {
      toast.error("Preencha nome, cidade e categoria");
      return;
    }
    createM.mutate(
      { nome: nome.trim(), cidadeId, categoriaId },
      {
        onSuccess: (row) => {
          setOpen(false);
          setNome("");
          window.location.href = `/estabelecimentos/${row.id}`;
        },
      },
    );
  }

  if (listQ.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (listQ.isError) {
    return <p className="text-destructive">Não foi possível carregar a lista.</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <CreateEstabelecimentoDialog
        open={open}
        onOpenChange={setOpen}
        nome={nome}
        setNome={setNome}
        cidadeId={cidadeId}
        setCidadeId={setCidadeId}
        categoriaId={categoriaId}
        setCategoriaId={setCategoriaId}
        cidades={cidades}
        categorias={categorias}
        isCreating={createM.isPending}
        onSubmit={submitCreate}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Estabelecimentos</h1>
          <p className="text-muted-foreground text-sm">Gerencie seus negócios no guia.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {!isTrueEmpty ? (
            <Input
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:w-56"
            />
          ) : null}
          <Button type="button" onClick={() => setOpen(true)} className="gap-2">
            <Plus className="size-4 shrink-0" aria-hidden />
            Adicionar estabelecimento
          </Button>
        </div>
      </div>

      {isSearchEmpty ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="bg-muted text-muted-foreground flex size-14 items-center justify-center rounded-full">
              <SearchX className="size-7" aria-hidden />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">Nenhum resultado</p>
              <p className="text-muted-foreground max-w-sm text-sm">
                Não encontramos estabelecimentos para &quot;{debouncedSearch}&quot;. Tente outro termo ou limpe
                a busca.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button type="button" variant="outline" onClick={() => setSearch("")}>
                Limpar busca
              </Button>
              <Button type="button" onClick={() => setOpen(true)} className="gap-2">
                <Plus className="size-4 shrink-0" aria-hidden />
                Novo estabelecimento
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {isTrueEmpty ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center sm:py-20">
            <div className="bg-primary/10 text-primary mb-8 flex size-20 items-center justify-center rounded-2xl">
              <Building2 className="size-10" aria-hidden />
            </div>
            <h2 className="text-foreground mb-3 max-w-md text-xl font-semibold tracking-tight sm:text-2xl">
              Você ainda não possui estabelecimentos cadastrados
            </h2>
            <p className="text-muted-foreground mb-10 max-w-md text-sm leading-relaxed sm:text-base">
              Comece pelo cadastro do seu primeiro negócio no guia. Em seguida você completa endereço, horários,
              mídias e demais informações na área de edição.
            </p>
            <Button type="button" size="lg" onClick={() => setOpen(true)} className="gap-2 px-8">
              <Plus className="size-5 shrink-0" aria-hidden />
              Criar meu primeiro estabelecimento
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!isTrueEmpty && !isSearchEmpty ? (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.nome}</TableCell>
                    <TableCell>{row.categoriaNome}</TableCell>
                    <TableCell>
                      {row.publicado ? "Publicado" : "Rascunho"}
                      {row.destaque ? " · Destaque" : ""}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/estabelecimentos/${row.id}`}>Editar</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
