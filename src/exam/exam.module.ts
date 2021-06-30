import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { ExamController } from './exam.controller';
import { Exam } from './exam.entity';
import { ExamService } from './exam.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exam, User])
  ],
  controllers: [ExamController],
  providers: [ExamService]
})
export class ExamModule {}
