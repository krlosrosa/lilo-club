import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI, { APIError } from 'openai';
import type { LlmRepository, LlmStructuredCompletionInput } from '../../domain/repositories/llm.repository.js';

@Injectable()
export class OpenAiLlmService implements LlmRepository {
  private readonly logger = new Logger(OpenAiLlmService.name);
  private readonly client: OpenAI | null;

  constructor(private readonly config: ConfigService) {
    const raw = this.config.get<string>('OPENAI_API_KEY');
    const apiKey = raw?.trim() || undefined;
    this.client = apiKey ? new OpenAI({ apiKey }) : null;
  }

  async completeStructured(input: LlmStructuredCompletionInput): Promise<unknown> {
    if (!this.client) {
      throw new ServiceUnavailableException('Serviço de IA não está configurado.');
    }

    const model =
      (this.config.get<string>('OPENAI_MODEL', 'gpt-4o-mini') ?? 'gpt-4o-mini').trim() || 'gpt-4o-mini';
    const isDev = this.config.get<string>('NODE_ENV') !== 'production';

    try {
      const completion = await this.client.chat.completions.create({
        model,
        messages: input.messages.map((m) => ({ role: m.role, content: m.content })),
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: input.schemaName,
            strict: true,
            schema: input.jsonSchema,
          },
        },
      });

      const message = completion.choices[0]?.message;
      if (message?.refusal != null && message.refusal !== '') {
        this.logger.warn(`OpenAI refusal: ${message.refusal}`);
        throw new BadGatewayException(
          'O modelo recusou gerar o texto por políticas de segurança. Tente ajustar o rascunho.',
        );
      }

      const rawContent = message?.content;
      const text = typeof rawContent === 'string' ? rawContent : null;

      if (text == null || text === '') {
        throw new BadGatewayException('Resposta do modelo vazia.');
      }

      try {
        return JSON.parse(text) as unknown;
      } catch {
        throw new BadGatewayException('Resposta do modelo inválida.');
      }
    } catch (err) {
      console.log(err);
      if (err instanceof BadGatewayException || err instanceof ServiceUnavailableException) {
        throw err;
      }
      if (err instanceof APIError) {
        const detail = err.message ?? 'erro desconhecido';
        const reqId = err.request_id ? ` (request_id: ${err.request_id})` : '';
        this.logger.warn(
          `OpenAI API ${String(err.status)} ${err.code ?? ''}: ${detail}${reqId}`,
        );
        const hint = this.openAiMessageForClient(err.status, detail);
        throw new BadGatewayException(isDev ? `${hint} — ${detail}` : hint);
      }
      this.logger.warn(`OpenAI completeStructured failed: ${String(err)}`);
      throw new BadGatewayException(
        isDev ? `Falha ao consultar o provedor de IA: ${String(err)}` : 'Falha ao consultar o provedor de IA.',
      );
    }
  }

  private openAiMessageForClient(status: number | undefined, message: string): string {
    if (status === 401) {
      return 'OpenAI recusou a chave (401). Verifique OPENAI_API_KEY no .env e reinicie a API.';
    }
    if (status === 403) {
      return 'OpenAI negou acesso (403). Confira permissões da chave e faturamento em platform.openai.com.';
    }
    if (status === 429) {
      return 'Limite de pedidos ou quota OpenAI (429). Tente mais tarde ou verifique o plano.';
    }
    if (status === 400 && /model/i.test(message)) {
      return 'Pedido rejeitado pelo modelo (400). Confira OPENAI_MODEL (ex.: gpt-4o-mini).';
    }
    return 'Falha ao consultar o provedor de IA.';
  }
}
