import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalSpecialtyController } from './clinical-specialty.controller';

describe('ClinicalSpecialtyController', () => {
  let controller: ClinicalSpecialtyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicalSpecialtyController],
    }).compile();

    controller = module.get<ClinicalSpecialtyController>(ClinicalSpecialtyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
