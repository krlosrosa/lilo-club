export const LLM_REPOSITORY = 'ILlmRepository';

export type LlmMessageRole = 'system' | 'user';

export type LlmStructuredMessage = {
  role: LlmMessageRole;
  content: string;
};

export type LlmStructuredCompletionInput = {
  messages: LlmStructuredMessage[];
  schemaName: string;
  jsonSchema: Record<string, unknown>;
};

export interface LlmRepository {
  completeStructured(input: LlmStructuredCompletionInput): Promise<unknown>;
}
