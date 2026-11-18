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
import { ZeroTrustModule } from './zero-trust/zero-trust.module';
import { AuditModule } from './audit/audit.module';
import { ModelsModule } from './models/models.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, AssetsModule, AiModule, IncidentsModule, SecurityModule, SensorsModule, FacilitiesModule, NotificationsModule, ReportsModule, MaintenanceModule, ZeroTrustModule, AuditModule, ModelsModule, InfrastructureModule, AnalyticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
