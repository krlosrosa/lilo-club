import { pgTable, text, integer, bigint, real, boolean } from 'drizzle-orm/pg-core';
import { accounts } from './saas';
import { cidades } from './cidades';
import { users } from './users';

export const categorias = pgTable('categorias', {
  id: text('id').primaryKey(),
  nome: text('nome').notNull(),
  ordem: integer('ordem').notNull().default(0),
});

export const estabelecimentos = pgTable('estabelecimentos', {
  id: text('id').primaryKey(),
  accountId: text('account_id')
    .notNull()
    .references(() => accounts.id, { onDelete: 'cascade' }),
  cidadeId: text('cidade_id')
    .notNull()
    .references(() => cidades.id, { onDelete: 'restrict' }),
  categoriaId: text('categoria_id')
    .notNull()
    .references(() => categorias.id, { onDelete: 'restrict' }),
  nome: text('nome').notNull(),
  slug: text('slug'),
  dominio: text('dominio').unique(),
  descricao: text('descricao'),
  conteudoSemantico: text('conteudo_semantico'),
  pesoDestaque: integer('peso_destaque').notNull().default(0),
  status: text('status').notNull().default('rascunho'),
  publicado: boolean('publicado').notNull().default(false),
  destaque: boolean('destaque').notNull().default(false),
  scoreMedio: real('score_medio'),
  totalAvaliacoes: integer('total_avaliacoes').notNull().default(0),
  codigoPublico: integer('codigo_publico'),
  createdByUserId: text('created_by_user_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  createdAt: bigint('created_at', { mode: 'number' }).notNull(),
  updatedAt: bigint('updated_at', { mode: 'number' }).notNull(),
});

export const estabelecimentosEnderecos = pgTable('estabelecimentos_enderecos', {
  estabelecimentoId: text('estabelecimento_id')
    .primaryKey()
    .references(() => estabelecimentos.id, { onDelete: 'cascade' }),
  cep: text('cep'),
  logradouro: text('logradouro'),
  bairro: text('bairro'),
  cidade: text('cidade'),
  uf: text('uf'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  localVerificado: boolean('local_verificado').notNull().default(false),
  atualizadoEm: bigint('atualizado_em', { mode: 'number' }),
});

export const estabelecimentosHorarioIntervalos = pgTable(
  'estabelecimentos_horario_intervalos',
  {
    id: text('id').primaryKey(),
    estabelecimentoId: text('estabelecimento_id')
      .notNull()
      .references(() => estabelecimentos.id, { onDelete: 'cascade' }),
    diaSemana: integer('dia_semana').notNull(),
    ordem: integer('ordem').notNull().default(0),
    abre: text('abre').notNull(),
    fecha: text('fecha').notNull(),
  },
);

export const estabelecimentosMidias = pgTable('estabelecimentos_midias', {
  id: text('id').primaryKey(),
  estabelecimentoId: text('estabelecimento_id')
    .notNull()
    .references(() => estabelecimentos.id, { onDelete: 'cascade' }),
  tipo: text('tipo').notNull(),
  storageKey: text('storage_key').notNull(),
  urlPublica: text('url_publica'),
  ordem: integer('ordem').notNull().default(0),
  createdAt: bigint('created_at', { mode: 'number' }).notNull(),
});

export const estabelecimentosAvaliacoes = pgTable('estabelecimentos_avaliacoes', {
  id: text('id').primaryKey(),
  estabelecimentoId: text('estabelecimento_id')
    .notNull()
    .references(() => estabelecimentos.id, { onDelete: 'cascade' }),
  autorId: text('autor_id').references(() => users.id, { onDelete: 'set null' }),
  nota: integer('nota').notNull(),
  comentario: text('comentario'),
  resposta: text('resposta'),
  respondidoEm: bigint('respondido_em', { mode: 'number' }),
  destaquePositivo: boolean('destaque_positivo').default(false),
  temMidia: boolean('tem_midia').notNull().default(false),
  utilCount: integer('util_count').notNull().default(0),
  createdAt: bigint('created_at', { mode: 'number' }).notNull(),
});
