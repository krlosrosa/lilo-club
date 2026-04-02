import type { CidadeAfiliadoRecord, CidadeRecord } from '../model/cidade.model.js';

export const CIDADE_REPOSITORY = 'ICidadeRepository';

export interface CidadeRepository {
  findById(id: string): Promise<CidadeRecord | null>;
  findBySlug(slug: string): Promise<CidadeRecord | null>;
  list(): Promise<CidadeRecord[]>;
  findAfiliadoAtivo(cidadeId: string): Promise<CidadeAfiliadoRecord | null>;
}
