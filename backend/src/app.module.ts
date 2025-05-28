import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // .env
import { MongooseModule } from '@nestjs/mongoose'; // Mongoose
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // variables .env
    MongooseModule.forRoot(process.env.MONGO_URI|| 'mongodb://localhost:27017/mi_basedatos'), // MongoDB
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
