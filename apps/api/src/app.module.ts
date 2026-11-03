import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AssetsModule } from './assets/assets.module';
import { AiModule } from './ai/ai.module';
import { IncidentsModule } from './incidents/incidents.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, AssetsModule, AiModule, IncidentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
