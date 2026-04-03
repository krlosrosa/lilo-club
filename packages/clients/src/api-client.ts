import { z } from 'zod';
import {
  accountMeResponseSchema,
  authMeResponseSchema,
  type AccountMeResponse,
  type AuthMeResponse,
  type CreateEstabelecimentoBody,
  createEstabelecimentoBodySchema,
  type EstabelecimentoDetail,
  estabelecimentoDetailSchema,
  estabelecimentoEnderecoSchema,
  type EstabelecimentoEndereco,
  healthResponseSchema,
  type HealthResponse,
  listCategoriasResponseSchema,
  type ListCategoriasResponse,
  listCidadesResponseSchema,
  type ListCidadesResponse,
  estabelecimentoAvaliacaoItemSchema,
  listEstabelecimentoAvaliacoesResponseSchema,
  type ListEstabelecimentoAvaliacoesResponse,
  listEstabelecimentoHorariosResponseSchema,
  type ListEstabelecimentoHorariosResponse,
  listEstabelecimentoMidiasResponseSchema,
  type ListEstabelecimentoMidiasResponse,
  listEstabelecimentosResponseSchema,
  type ListEstabelecimentosResponse,
  midiaUploadResponseSchema,
  type MidiaUploadResponse,
  type PatchAuthMeBody,
  type PatchEstabelecimentoAvaliacaoBody,
  type PatchEstabelecimentoBody,
  type PatchEstabelecimentoEnderecoBody,
  type PatchMidiasOrdemBody,
  type PostSuggestEstabelecimentoDescricaoBody,
  patchEstabelecimentoAvaliacaoBodySchema,
  patchEstabelecimentoBodySchema,
  patchEstabelecimentoEnderecoBodySchema,
  patchMidiasOrdemBodySchema,
  patchAuthMeBodySchema,
  postSuggestEstabelecimentoDescricaoBodySchema,
  postSuggestEstabelecimentoHorarioBodySchema,
  type PostSuggestEstabelecimentoHorarioBody,
  putEstabelecimentoHorariosBodySchema,
  type PutEstabelecimentoHorariosBody,
  suggestEstabelecimentoDescricaoResponseSchema,
  type SuggestEstabelecimentoDescricaoResponse,
  suggestEstabelecimentoHorarioResponseSchema,
  type SuggestEstabelecimentoHorarioResponse,
} from '@lilo-hub/contracts';

export type HostContext = { domain: string; subdomain: string };

export type ApiClientConfig = {
  baseUrl: string;
  fetchImpl?: typeof fetch;
  /** default `omit`; use `include` para cookie HttpOnly na mesma política de CORS */
  credentials?: RequestCredentials;
  /** Token Bearer; omitir em fluxo só com cookie HttpOnly + `credentials: 'include'`. */
  getAccessToken?: () => string | null;
  /** Enviado como `X-Host-Domain` e `X-Host-Subdomain` em cada pedido ao backend. */
  getHostContext?: () => HostContext;
};

type HeaderConfig = Pick<ApiClientConfig, 'getAccessToken' | 'getHostContext'>;

function buildHeaders(config: HeaderConfig, contentTypeJson = true): HeadersInit {
  const headers: Record<string, string> = {};
  if (contentTypeJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = config.getAccessToken?.();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const host = config.getHostContext?.();
  if (host) {
    headers['X-Host-Domain'] = host.domain;
    headers['X-Host-Subdomain'] = host.subdomain;
  }
  return headers;
}

async function parseJson<T>(res: Response, schema: z.ZodType<T>): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  const json: unknown = await res.json();
  return schema.parse(json);
}

export function createApiClient(config: ApiClientConfig) {
  const fetchFn = config.fetchImpl ?? fetch;
  const base = config.baseUrl.replace(/\/$/, '');
  const credentials = config.credentials ?? 'omit';

  const jsonRequest = async <T>(
    path: string,
    schema: z.ZodType<T>,
    init?: RequestInit,
  ): Promise<T> => {
    const res = await fetchFn(`${base}${path}`, {
      ...init,
      credentials,
      headers: {
        ...buildHeaders(config),
        ...(init?.headers as Record<string, string> | undefined),
      },
    });
    return parseJson(res, schema);
  };

  return {
    async getHealth(): Promise<HealthResponse> {
      const res = await fetchFn(`${base}/health`, {
        credentials,
        headers: buildHeaders(config, false),
      });
      return parseJson(res, healthResponseSchema);
    },

    async getMe(): Promise<AuthMeResponse> {
      return jsonRequest('/auth/me', authMeResponseSchema);
    },

    async patchMe(body: PatchAuthMeBody): Promise<AuthMeResponse> {
      const parsed = patchAuthMeBodySchema.parse(body);
      return jsonRequest('/auth/me', authMeResponseSchema, {
        method: 'PATCH',
        body: JSON.stringify(parsed),
      });
    },

    async postLogout(): Promise<void> {
      const res = await fetchFn(`${base}/auth/logout`, {
        method: 'POST',
        credentials,
        headers: buildHeaders(config),
      });
      if (!res.ok) {
        throw new Error(`Logout failed: ${res.status}`);
      }
    },

    async getAccountMe(): Promise<AccountMeResponse> {
      return jsonRequest('/accounts/me', accountMeResponseSchema);
    },

    async getCatalogCidades(): Promise<ListCidadesResponse> {
      return jsonRequest('/catalog/cidades', listCidadesResponseSchema);
    },

    async getCatalogCategorias(): Promise<ListCategoriasResponse> {
      return jsonRequest('/catalog/categorias', listCategoriasResponseSchema);
    },

    async listEstabelecimentos(search?: string): Promise<ListEstabelecimentosResponse> {
      const q = search ? `?search=${encodeURIComponent(search)}` : '';
      return jsonRequest(`/estabelecimentos${q}`, listEstabelecimentosResponseSchema);
    },

    async createEstabelecimento(body: CreateEstabelecimentoBody): Promise<EstabelecimentoDetail> {
      const parsed = createEstabelecimentoBodySchema.parse(body);
      return jsonRequest('/estabelecimentos', estabelecimentoDetailSchema, {
        method: 'POST',
        body: JSON.stringify(parsed),
      });
    },

    async getEstabelecimento(id: string): Promise<EstabelecimentoDetail> {
      return jsonRequest(`/estabelecimentos/${id}`, estabelecimentoDetailSchema);
    },

    async patchEstabelecimento(
      id: string,
      body: PatchEstabelecimentoBody,
    ): Promise<EstabelecimentoDetail> {
      const parsed = patchEstabelecimentoBodySchema.parse(body);
      return jsonRequest(`/estabelecimentos/${id}`, estabelecimentoDetailSchema, {
        method: 'PATCH',
        body: JSON.stringify(parsed),
      });
    },

    async postSuggestEstabelecimentoDescricao(
      id: string,
      body: PostSuggestEstabelecimentoDescricaoBody,
    ): Promise<SuggestEstabelecimentoDescricaoResponse> {
      const parsed = postSuggestEstabelecimentoDescricaoBodySchema.parse(body);
      return jsonRequest(
        `/estabelecimentos/${id}/suggest-descricao`,
        suggestEstabelecimentoDescricaoResponseSchema,
        {
          method: 'POST',
          body: JSON.stringify(parsed),
        },
      );
    },

    async postSuggestEstabelecimentoHorario(
      id: string,
      body: PostSuggestEstabelecimentoHorarioBody,
    ): Promise<SuggestEstabelecimentoHorarioResponse> {
      const parsed = postSuggestEstabelecimentoHorarioBodySchema.parse(body);
      return jsonRequest(
        `/estabelecimentos/${id}/suggest-horarios`,
        suggestEstabelecimentoHorarioResponseSchema,
        {
          method: 'POST',
          body: JSON.stringify(parsed),
        },
      );
    },

    async getEstabelecimentoEndereco(
      id: string,
    ): Promise<EstabelecimentoEndereco | null> {
      const res = await fetchFn(`${base}/estabelecimentos/${id}/endereco`, {
        credentials,
        headers: buildHeaders(config),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
      }
      const json: unknown = await res.json();
      return z.union([estabelecimentoEnderecoSchema, z.null()]).parse(json);
    },

    async patchEstabelecimentoEndereco(
      id: string,
      body: PatchEstabelecimentoEnderecoBody,
    ): Promise<EstabelecimentoEndereco> {
      const parsed = patchEstabelecimentoEnderecoBodySchema.parse(body);
      return jsonRequest(
        `/estabelecimentos/${id}/endereco`,
        estabelecimentoEnderecoSchema,
        {
          method: 'PATCH',
          body: JSON.stringify(parsed),
        },
      );
    },

    async getEstabelecimentoHorarios(
      id: string,
    ): Promise<ListEstabelecimentoHorariosResponse> {
      return jsonRequest(
        `/estabelecimentos/${id}/horarios`,
        listEstabelecimentoHorariosResponseSchema,
      );
    },

    async putEstabelecimentoHorarios(
      id: string,
      body: PutEstabelecimentoHorariosBody,
    ): Promise<ListEstabelecimentoHorariosResponse> {
      const parsed = putEstabelecimentoHorariosBodySchema.parse(body);
      return jsonRequest(
        `/estabelecimentos/${id}/horarios`,
        listEstabelecimentoHorariosResponseSchema,
        {
          method: 'PUT',
          body: JSON.stringify(parsed),
        },
      );
    },

    async listEstabelecimentoMidias(id: string): Promise<ListEstabelecimentoMidiasResponse> {
      return jsonRequest(
        `/estabelecimentos/${id}/midias`,
        listEstabelecimentoMidiasResponseSchema,
      );
    },

    async uploadEstabelecimentoMidia(
      id: string,
      file: File,
      tipo: 'logo' | 'capa' | 'galeria',
    ): Promise<MidiaUploadResponse> {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('tipo', tipo);
      const res = await fetchFn(`${base}/estabelecimentos/${id}/midias`, {
        method: 'POST',
        credentials,
        headers: buildHeaders(config, false),
        body: fd,
      });
      return parseJson(res, midiaUploadResponseSchema);
    },

    async deleteEstabelecimentoMidia(id: string, midiaId: string): Promise<void> {
      const res = await fetchFn(`${base}/estabelecimentos/${id}/midias/${midiaId}`, {
        method: 'DELETE',
        credentials,
        headers: buildHeaders(config),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
      }
    },

    async patchEstabelecimentoMidiasOrdem(
      id: string,
      body: PatchMidiasOrdemBody,
    ): Promise<ListEstabelecimentoMidiasResponse> {
      const parsed = patchMidiasOrdemBodySchema.parse(body);
      return jsonRequest(
        `/estabelecimentos/${id}/midias/ordem`,
        listEstabelecimentoMidiasResponseSchema,
        {
          method: 'PATCH',
          body: JSON.stringify(parsed),
        },
      );
    },

    async listEstabelecimentoAvaliacoes(
      id: string,
      page = 0,
      pageSize = 20,
    ): Promise<ListEstabelecimentoAvaliacoesResponse> {
      const q = `?page=${page}&pageSize=${pageSize}`;
      return jsonRequest(
        `/estabelecimentos/${id}/avaliacoes${q}`,
        listEstabelecimentoAvaliacoesResponseSchema,
      );
    },

    async patchEstabelecimentoAvaliacao(
      id: string,
      avaliacaoId: string,
      body: PatchEstabelecimentoAvaliacaoBody,
    ) {
      const parsed = patchEstabelecimentoAvaliacaoBodySchema.parse(body);
      return jsonRequest(
        `/estabelecimentos/${id}/avaliacoes/${avaliacaoId}`,
        estabelecimentoAvaliacaoItemSchema,
        {
          method: 'PATCH',
          body: JSON.stringify(parsed),
        },
      );
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
