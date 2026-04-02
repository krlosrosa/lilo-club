import { Module } from '@nestjs/common';
import { CreateEstabelecimentoUsecase } from '../../application/usecases/create-estabelecimento.usecase.js';
import { DeleteEstabelecimentoMidiaUsecase } from '../../application/usecases/delete-estabelecimento-midia.usecase.js';
import { GetEstabelecimentoEnderecoUsecase } from '../../application/usecases/get-estabelecimento-endereco.usecase.js';
import { GetEstabelecimentoHorariosUsecase } from '../../application/usecases/get-estabelecimento-horarios.usecase.js';
import { GetEstabelecimentoUsecase } from '../../application/usecases/get-estabelecimento.usecase.js';
import { ListEstabelecimentoAvaliacoesUsecase } from '../../application/usecases/list-estabelecimento-avaliacoes.usecase.js';
import { ListEstabelecimentoMidiasUsecase } from '../../application/usecases/list-estabelecimento-midias.usecase.js';
import { ListEstabelecimentosUsecase } from '../../application/usecases/list-estabelecimentos.usecase.js';
import { PatchEstabelecimentoAvaliacaoUsecase } from '../../application/usecases/patch-estabelecimento-avaliacao.usecase.js';
import { PatchEstabelecimentoEnderecoUsecase } from '../../application/usecases/patch-estabelecimento-endereco.usecase.js';
import { PatchEstabelecimentoMidiasOrdemUsecase } from '../../application/usecases/patch-estabelecimento-midias-ordem.usecase.js';
import { PatchEstabelecimentoUsecase } from '../../application/usecases/patch-estabelecimento.usecase.js';
import { PutEstabelecimentoHorariosUsecase } from '../../application/usecases/put-estabelecimento-horarios.usecase.js';
import { SuggestAvaliacaoRespostaUsecase } from '../../application/usecases/suggest-avaliacao-resposta.usecase.js';
import { UploadEstabelecimentoMidiaUsecase } from '../../application/usecases/upload-estabelecimento-midia.usecase.js';
import { ESTABELECIMENTO_REPOSITORY } from '../../domain/repositories/estabelecimento.repository.js';
import { CreateEstabelecimentoController } from '../../presentation/controllers/estabelecimento/create-estabelecimento.controller.js';
import { DeleteEstabelecimentoMidiaController } from '../../presentation/controllers/estabelecimento/delete-estabelecimento-midia.controller.js';
import { GetEstabelecimentoEnderecoController } from '../../presentation/controllers/estabelecimento/get-estabelecimento-endereco.controller.js';
import { GetEstabelecimentoHorariosController } from '../../presentation/controllers/estabelecimento/get-estabelecimento-horarios.controller.js';
import { GetEstabelecimentoController } from '../../presentation/controllers/estabelecimento/get-estabelecimento.controller.js';
import { ListEstabelecimentoAvaliacoesController } from '../../presentation/controllers/estabelecimento/list-estabelecimento-avaliacoes.controller.js';
import { ListEstabelecimentoMidiasController } from '../../presentation/controllers/estabelecimento/list-estabelecimento-midias.controller.js';
import { ListEstabelecimentosController } from '../../presentation/controllers/estabelecimento/list-estabelecimentos.controller.js';
import { PatchEstabelecimentoAvaliacaoController } from '../../presentation/controllers/estabelecimento/patch-estabelecimento-avaliacao.controller.js';
import { PostSuggestAvaliacaoRespostaController } from '../../presentation/controllers/estabelecimento/post-suggest-avaliacao-resposta.controller.js';
import { PatchEstabelecimentoEnderecoController } from '../../presentation/controllers/estabelecimento/patch-estabelecimento-endereco.controller.js';
import { PatchEstabelecimentoMidiasOrdemController } from '../../presentation/controllers/estabelecimento/patch-estabelecimento-midias-ordem.controller.js';
import { PatchEstabelecimentoController } from '../../presentation/controllers/estabelecimento/patch-estabelecimento.controller.js';
import { PutEstabelecimentoHorariosController } from '../../presentation/controllers/estabelecimento/put-estabelecimento-horarios.controller.js';
import { UploadEstabelecimentoMidiaController } from '../../presentation/controllers/estabelecimento/upload-estabelecimento-midia.controller.js';
import { EstabelecimentoRepositoryService } from '../db/estabelecimento/estabelecimento.service.js';
import { R2StorageModule } from '../storage/r2/r2-storage.module.js';
import { AccountModule } from './account.module.js';
import { AuthModule } from './auth.module.js';
import { LlmModule } from './llm.module.js';

@Module({
  imports: [AuthModule, AccountModule, R2StorageModule, LlmModule],
  controllers: [
    ListEstabelecimentosController,
    CreateEstabelecimentoController,
    GetEstabelecimentoEnderecoController,
    PatchEstabelecimentoEnderecoController,
    GetEstabelecimentoHorariosController,
    PutEstabelecimentoHorariosController,
    ListEstabelecimentoMidiasController,
    UploadEstabelecimentoMidiaController,
    DeleteEstabelecimentoMidiaController,
    PatchEstabelecimentoMidiasOrdemController,
    ListEstabelecimentoAvaliacoesController,
    PatchEstabelecimentoAvaliacaoController,
    PostSuggestAvaliacaoRespostaController,
    GetEstabelecimentoController,
    PatchEstabelecimentoController,
  ],
  providers: [
    { provide: ESTABELECIMENTO_REPOSITORY, useClass: EstabelecimentoRepositoryService },
    ListEstabelecimentosUsecase,
    CreateEstabelecimentoUsecase,
    GetEstabelecimentoUsecase,
    PatchEstabelecimentoUsecase,
    GetEstabelecimentoEnderecoUsecase,
    PatchEstabelecimentoEnderecoUsecase,
    GetEstabelecimentoHorariosUsecase,
    PutEstabelecimentoHorariosUsecase,
    ListEstabelecimentoMidiasUsecase,
    UploadEstabelecimentoMidiaUsecase,
    DeleteEstabelecimentoMidiaUsecase,
    PatchEstabelecimentoMidiasOrdemUsecase,
    ListEstabelecimentoAvaliacoesUsecase,
    PatchEstabelecimentoAvaliacaoUsecase,
    SuggestAvaliacaoRespostaUsecase,
  ],
  exports: [ESTABELECIMENTO_REPOSITORY],
})
export class EstabelecimentoModule {}
