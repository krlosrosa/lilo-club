import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { accounts } from './saas';
import { cidades } from './cidades';
import { users } from './users';

export const categorias = sqliteTable('categorias', {
  id: text('id').primaryKey(),
  nome: text('nome').notNull(),
  ordem: integer('ordem', { mode: 'number' }).notNull().default(0),
});

export const estabelecimentos = sqliteTable('estabelecimentos', {
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
  pesoDestaque: integer('peso_destaque', { mode: 'number' }).notNull().default(0),
  status: text('status').notNull().default('rascunho'),
  publicado: integer('publicado', { mode: 'boolean' }).notNull().default(false),
  destaque: integer('destaque', { mode: 'boolean' }).notNull().default(false),
  scoreMedio: real('score_medio'),
  totalAvaliacoes: integer('total_avaliacoes', { mode: 'number' }).notNull().default(0),
  codigoPublico: integer('codigo_publico', { mode: 'number' }),
  createdByUserId: text('created_by_user_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }).notNull(),
});

export const estabelecimentosEnderecos = sqliteTable('estabelecimentos_enderecos', {
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
  localVerificado: integer('local_verificado', { mode: 'boolean' })
    .notNull()
    .default(false),
  atualizadoEm: integer('atualizado_em', { mode: 'number' }),
});

export const estabelecimentosHorarioIntervalos = sqliteTable(
  'estabelecimentos_horario_intervalos',
  {
    id: text('id').primaryKey(),
    estabelecimentoId: text('estabelecimento_id')
      .notNull()
      .references(() => estabelecimentos.id, { onDelete: 'cascade' }),
    diaSemana: integer('dia_semana', { mode: 'number' }).notNull(),
    ordem: integer('ordem', { mode: 'number' }).notNull().default(0),
    abre: text('abre').notNull(),
    fecha: text('fecha').notNull(),
  },
);

export const estabelecimentosMidias = sqliteTable('estabelecimentos_midias', {
  id: text('id').primaryKey(),
  estabelecimentoId: text('estabelecimento_id')
    .notNull()
    .references(() => estabelecimentos.id, { onDelete: 'cascade' }),
  tipo: text('tipo').notNull(),
  storageKey: text('storage_key').notNull(),
  urlPublica: text('url_publica'),
  ordem: integer('ordem', { mode: 'number' }).notNull().default(0),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
});

/** Nome prefixado para FK após `estabelecimentos` na ordem lexicográfica do SQLite. */
export const estabelecimentosAvaliacoes = sqliteTable('estabelecimentos_avaliacoes', {
  id: text('id').primaryKey(),
  estabelecimentoId: text('estabelecimento_id')
    .notNull()
    .references(() => estabelecimentos.id, { onDelete: 'cascade' }),
  autorId: text('autor_id').references(() => users.id, { onDelete: 'set null' }),
  nota: integer('nota', { mode: 'number' }).notNull(),
  comentario: text('comentario'),
  resposta: text('resposta'),
  respondidoEm: integer('respondido_em', { mode: 'number' }),
  destaquePositivo: integer('destaque_positivo', { mode: 'boolean' }).default(false),
  temMidia: integer('tem_midia', { mode: 'boolean' }).notNull().default(false),
  utilCount: integer('util_count', { mode: 'number' }).notNull().default(0),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
});
