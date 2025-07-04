import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UserSeeder } from './users/seeders/user.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // Puerto de Vite
    credentials: true,
  });
  
  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,  //admitir lo que esta en dto
      forbidNonWhitelisted: true,  //error si hay algo que no esta en dto
      transform: true, //transformar el objeto a la clase del dto
    })
  );
  
  // Ejecutar el seeder
  const userSeeder = app.get(UserSeeder);
  await userSeeder.seed();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
