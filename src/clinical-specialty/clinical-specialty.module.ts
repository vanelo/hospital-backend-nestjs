import { Module } from '@nestjs/common';
import { ClinicalSpecialtyController } from './clinical-specialty.controller';
import { ClinicalSpecialtyService } from './clinical-specialty.service';

@Module({
  controllers: [ClinicalSpecialtyController],
  providers: [ClinicalSpecialtyService]
})
export class ClinicalSpecialtyModule {}
