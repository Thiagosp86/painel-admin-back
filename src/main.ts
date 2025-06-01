import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // Habilita CORS para permitir requisições do frontend
  app.enableCors({
    origin: 'http://localhost:5173', // ou '*', mas não recomendado em produção
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
