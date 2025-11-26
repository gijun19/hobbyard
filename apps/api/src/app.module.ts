import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CardsModule } from './cards/cards.module';
import { BuyerBoxModule } from './buyer-box/buyer-box.module';
import { OrdersModule } from './orders/orders.module';
import { IntakeBatchesModule } from './intake-batches/intake-batches.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    CardsModule,
    BuyerBoxModule,
    OrdersModule,
    IntakeBatchesModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
