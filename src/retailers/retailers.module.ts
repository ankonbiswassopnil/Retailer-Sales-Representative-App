import { Module } from '@nestjs/common';
import { RetailersController } from './retailers.controller';
import { RetailersService } from './retailers.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RetailersController],
  providers: [RetailersService],
})
export class RetailersModule {}