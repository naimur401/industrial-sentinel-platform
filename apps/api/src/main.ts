import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Industrial Sentinel API')
    .setDescription('AI-Powered Industrial Intelligence, Cybersecurity & Infrastructure Operations Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('assets', 'Asset management')
    .addTag('ai', 'AI predictions')
    .addTag('incidents', 'Incident management')
    .addTag('security', 'Cybersecurity & threats')
    .addTag('infrastructure', 'IT infrastructure monitoring')
    .addTag('models', 'ML model registry')
    .addTag('analytics', 'Analytics & reporting')
    .addTag('users', 'User management')
    .addTag('notifications', 'Notifications')
    .addTag('reports', 'Reports')
    .addTag('maintenance', 'Maintenance work orders')
    .addTag('zero-trust', 'Zero Trust policies')
    .addTag('audit', 'Audit logs')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(3000);
  console.log('?? API Server: http://localhost:3000');
  console.log('?? Swagger Docs: http://localhost:3000/api/docs');
}
bootstrap();
