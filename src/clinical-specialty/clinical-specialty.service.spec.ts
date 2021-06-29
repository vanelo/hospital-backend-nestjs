import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalSpecialtyService } from './clinical-specialty.service';

describe('ClinicalSpecialtyService', () => {
  let service: ClinicalSpecialtyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClinicalSpecialtyService],
    }).compile();

    service = module.get<ClinicalSpecialtyService>(ClinicalSpecialtyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
