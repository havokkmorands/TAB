import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './common/filters/prisma-exception-filter';
import { EntityNotFoundExceptionFilter } from './common/filters/entity-not-found-exception-filter';
import { LoginExceptionFilter } from './common/filters/login-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new PrismaExceptionFilter(),
    new EntityNotFoundExceptionFilter(),
    new LoginExceptionFilter(),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
