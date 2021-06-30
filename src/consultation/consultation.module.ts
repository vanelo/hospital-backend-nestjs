import { Module } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { ConsultationController } from './consultation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultation } from './consultation.entity';
import { User } from 'src/auth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consultation, User])
  ],
  providers: [ConsultationService],
  controllers: [ConsultationController]
})
export class ConsultationModule {}
