import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { UploadEstabelecimentoMidiaUsecase } from '../../../application/usecases/upload-estabelecimento-midia.usecase.js';
import { JwtAuthGuard } from '../../../infra/auth/jwt-auth.guard.js';
import { CurrentUserId } from '../../decorators/current-user.decorator.js';

@ApiTags('estabelecimentos')
@Controller('estabelecimentos')
export class UploadEstabelecimentoMidiaController {
  constructor(private readonly uploadMidia: UploadEstabelecimentoMidiaUsecase) {}

  @Post(':id/midias')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 8 * 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        tipo: { type: 'string', enum: ['logo', 'capa', 'galeria'] },
      },
      required: ['file', 'tipo'],
    },
  })
  @ApiOperation({ summary: 'Upload de mídia', operationId: 'uploadEstabelecimentoMidia' })
  execute(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body('tipo') tipo: string,
  ) {
    if (!file?.buffer) {
      throw new BadRequestException('Arquivo obrigatório');
    }
    const ct = file.mimetype || 'application/octet-stream';
    return this.uploadMidia.execute({
      userId,
      estabelecimentoId: id,
      tipoRaw: tipo ?? 'galeria',
      buffer: file.buffer,
      contentType: ct,
    });
  }
}
