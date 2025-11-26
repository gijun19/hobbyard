import { Module } from '@nestjs/common';
import { IntakeBatchesService } from './intake-batches.service';
import { IntakeBatchesController } from './intake-batches.controller';

@Module({
  controllers: [IntakeBatchesController],
  providers: [IntakeBatchesService],
  exports: [IntakeBatchesService],
})
export class IntakeBatchesModule {}
