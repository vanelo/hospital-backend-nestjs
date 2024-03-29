import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClinicalSpecialtyModule } from './clinical-specialty/clinical-specialty.module';
import { ConsultationModule } from './consultation/consultation.module';
import { ExamModule } from './exam/exam.module';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
      envFilePath: `dev.env`
    }),
    TypeOrmModule.forRootAsync({
      useFactory: process.env.NODE_ENV !== 'production'
        ? ormConfig : ormConfigProd
    }),
    AuthModule,
    ClinicalSpecialtyModule,
    ConsultationModule,
    ExamModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
