import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { BuyerBoxService } from './buyer-box.service';
import { AddToBoxDto } from './dto/add-to-box.dto';
import { RemoveFromBoxDto } from './dto/remove-from-box.dto';

@Controller('buyer-box')
export class BuyerBoxController {
  constructor(private readonly buyerBoxService: BuyerBoxService) {}

  @Post('add')
  addToBox(@Body() dto: AddToBoxDto) {
    return this.buyerBoxService.addToBox(dto);
  }

  @Post('remove')
  removeFromBox(@Body() dto: RemoveFromBoxDto) {
    return this.buyerBoxService.removeFromBox(dto);
  }

  @Get(':buyerId')
  getBox(@Param('buyerId') buyerId: string) {
    return this.buyerBoxService.getBox(buyerId);
  }

  @Delete(':buyerId')
  clearBox(@Param('buyerId') buyerId: string) {
    return this.buyerBoxService.clearBox(buyerId);
  }
}
