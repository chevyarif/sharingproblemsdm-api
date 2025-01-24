import { Test, TestingModule } from '@nestjs/testing';
import { PertanyaanService } from './pertanyaan.service';

describe('PertanyaanService', () => {
  let service: PertanyaanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PertanyaanService],
    }).compile();

    service = module.get<PertanyaanService>(PertanyaanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
