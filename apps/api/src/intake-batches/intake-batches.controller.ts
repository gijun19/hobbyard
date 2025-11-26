import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { IntakeBatchesService } from './intake-batches.service';
import { CreateIntakeBatchDto } from './dto/create-intake-batch.dto';
import { UpdateBatchStatusDto } from './dto/update-batch-status.dto';

@Controller('intake-batches')
export class IntakeBatchesController {
  constructor(
    private readonly intakeBatchesService: IntakeBatchesService,
  ) {}

  @Post()
  create(@Body() createDto: CreateIntakeBatchDto) {
    return this.intakeBatchesService.create(createDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('status') status?: string,
  ) {
    return this.intakeBatchesService.findAll(skip, take, status);
  }

  @Get('seller/:sellerId')
  findBySeller(@Param('sellerId') sellerId: string) {
    return this.intakeBatchesService.findBySeller(sellerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.intakeBatchesService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateBatchStatusDto) {
    return this.intakeBatchesService.updateStatus(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.intakeBatchesService.delete(id);
  }
}
