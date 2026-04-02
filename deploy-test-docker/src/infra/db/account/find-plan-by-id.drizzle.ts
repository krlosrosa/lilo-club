import { eq } from 'drizzle-orm';
import type { PlanRecord } from '../../../domain/model/account-saas.model.js';
import { plans } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapPlanRow } from './map-account-rows.js';

export async function findPlanByIdDb(
  db: DrizzleClient,
  planId: string,
): Promise<PlanRecord | null> {
  const rows = await db.select().from(plans).where(eq(plans.id, planId)).limit(1);
  const row = rows[0];
  if (!row) return null;
  return mapPlanRow(row);
}
