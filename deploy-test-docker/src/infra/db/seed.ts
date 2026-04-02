/**
 * Idempotent catalog seed: cidades, categorias, modulos, plans, plan_modulos.
 * Run: pnpm --filter @lilo-hub/api db:seed
 * Requires schema: pnpm --filter @lilo-hub/api db:push
 */
import { createDrizzleClient } from './providers/drizzle/drizzle.provider.js';
import {
  categorias,
  cidades,
  modulos,
  planModulos,
  plans,
} from './providers/drizzle/config/migrations/index.js';
import { SEED_IDS } from './seed.constants.js';

const now = () => Date.now();

async function main() {
  const db = createDrizzleClient();

  await db
    .insert(cidades)
    .values([
      {
        id: SEED_IDS.cidadeSp,
        nome: 'São Paulo',
        uf: 'SP',
        slug: 'sao-paulo-sp',
        createdAt: now(),
      },
      {
        id: SEED_IDS.cidadeCampinas,
        nome: 'Campinas',
        uf: 'SP',
        slug: 'campinas-sp',
        createdAt: now(),
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(categorias)
    .values([
      { id: SEED_IDS.categoriaRestaurante, nome: 'Restaurante', ordem: 1 },
      { id: SEED_IDS.categoriaLoja, nome: 'Loja', ordem: 2 },
      { id: SEED_IDS.categoriaServico, nome: 'Serviço', ordem: 3 },
      { id: SEED_IDS.categoriaBar, nome: 'Bar & Pub', ordem: 4 },
    ])
    .onConflictDoNothing();

  await db
    .insert(modulos)
    .values([
      {
        id: SEED_IDS.moduloAgendamento,
        slug: 'agendamento',
        nome: 'Agendamento',
        descricao: 'Gestão de horários e reservas',
        ordem: 1,
      },
      {
        id: SEED_IDS.moduloFidelidade,
        slug: 'fidelidade',
        nome: 'Cartão Fidelidade',
        descricao: 'Pontos e recompensas',
        ordem: 2,
      },
      {
        id: SEED_IDS.moduloMapaCupons,
        slug: 'mapa_cupons',
        nome: 'Mapa de Cupons',
        descricao: 'Ofertas por proximidade',
        ordem: 3,
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(plans)
    .values([
      {
        id: SEED_IDS.planFree,
        slug: 'free',
        nome: 'Free',
        maxEstabelecimentos: 1,
        maxMidiasPorEstabelecimento: 5,
        seloPremium: false,
        ordem: 1,
        createdAt: now(),
      },
      {
        id: SEED_IDS.planPremium,
        slug: 'premium',
        nome: 'Premium',
        maxEstabelecimentos: 10,
        maxMidiasPorEstabelecimento: 50,
        seloPremium: true,
        ordem: 2,
        createdAt: now(),
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(planModulos)
    .values([
      { planId: SEED_IDS.planPremium, moduloId: SEED_IDS.moduloAgendamento },
      { planId: SEED_IDS.planPremium, moduloId: SEED_IDS.moduloFidelidade },
      { planId: SEED_IDS.planPremium, moduloId: SEED_IDS.moduloMapaCupons },
    ])
    .onConflictDoNothing();

  // eslint-disable-next-line no-console -- CLI output
  console.log('Seed catalog OK (cidades, categorias, modulos, plans, plan_modulos).');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
