import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AssetsModule } from './assets/assets.module';
import { AiModule } from './ai/ai.module';
import { IncidentsModule } from './incidents/incidents.module';
import { SecurityModule } from './security/security.module';
import { SensorsModule } from './sensors/sensors.module';
import { FacilitiesModule } from './facilities/facilities.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { MaintenanceModule } from './maintenance/maintenance.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, AssetsModule, AiModule, IncidentsModule, SecurityModule, SensorsModule, FacilitiesModule, NotificationsModule, ReportsModule, MaintenanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
