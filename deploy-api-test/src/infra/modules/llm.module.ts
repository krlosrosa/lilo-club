import { Module } from '@nestjs/common';
import { LLM_REPOSITORY } from '../../domain/repositories/llm.repository.js';
import { OpenAiLlmService } from '../llm/openai-llm.service.js';

@Module({
  providers: [{ provide: LLM_REPOSITORY, useClass: OpenAiLlmService }],
  exports: [LLM_REPOSITORY],
})
export class LlmModule {}
