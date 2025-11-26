import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CardsService } from './cards.service';
import { StorageService } from '../storage/storage.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { QueryCardsDto } from './dto/query-cards.dto';

@Controller('cards')
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  @Get()
  findAll(@Query() query: QueryCardsDto) {
    return this.cardsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(id, updateCardDto);
  }

  @Post(':id/images')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'front', maxCount: 1 },
      { name: 'back', maxCount: 1 },
    ]),
  )
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      front?: Express.Multer.File[];
      back?: Express.Multer.File[];
    },
  ) {
    const frontFile = files.front?.[0];
    const backFile = files.back?.[0];

    if (!frontFile && !backFile) {
      throw new BadRequestException('At least one image file is required');
    }

    let frontImageUrl: string | undefined;
    let backImageUrl: string | undefined;

    if (frontFile) {
      frontImageUrl = await this.storageService.uploadCardImage(
        frontFile,
        id,
        'front',
      );
    }

    if (backFile) {
      backImageUrl = await this.storageService.uploadCardImage(
        backFile,
        id,
        'back',
      );
    }

    return this.cardsService.updateImages(id, frontImageUrl, backImageUrl);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardsService.remove(id);
  }

  @Delete(':id/hard')
  hardDelete(@Param('id') id: string) {
    return this.cardsService.hardDelete(id);
  }
}
