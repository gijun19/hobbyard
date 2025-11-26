import { Module } from '@nestjs/common';
import { BuyerBoxService } from './buyer-box.service';
import { BuyerBoxController } from './buyer-box.controller';

@Module({
  controllers: [BuyerBoxController],
  providers: [BuyerBoxService],
  exports: [BuyerBoxService],
})
export class BuyerBoxModule {}
