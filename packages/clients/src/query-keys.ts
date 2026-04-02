export const queryKeys = {
  accountMe: ['accountMe'] as const,
  authMe: ['authMe'] as const,
  catalogCidades: ['catalog', 'cidades'] as const,
  catalogCategorias: ['catalog', 'categorias'] as const,
  estabelecimentos: (search?: string) => ['estabelecimentos', { search }] as const,
  estabelecimento: (id: string) => ['estabelecimento', id] as const,
  endereco: (id: string) => ['estabelecimento', id, 'endereco'] as const,
  horarios: (id: string) => ['estabelecimento', id, 'horarios'] as const,
  midias: (id: string) => ['estabelecimento', id, 'midias'] as const,
  avaliacoes: (id: string, page: number, pageSize: number) =>
    ['estabelecimento', id, 'avaliacoes', { page, pageSize }] as const,
};
