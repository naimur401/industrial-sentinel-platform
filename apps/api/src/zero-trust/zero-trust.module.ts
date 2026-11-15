import { Module } from '@nestjs/common';
import { ZeroTrustService } from './zero-trust.service';
import { ZeroTrustController } from './zero-trust.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ZeroTrustController],
  providers: [ZeroTrustService],
  exports: [ZeroTrustService],
})
export class ZeroTrustModule {}
