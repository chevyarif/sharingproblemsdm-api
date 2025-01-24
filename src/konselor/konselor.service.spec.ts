import { Test, TestingModule } from '@nestjs/testing';
import { KonselorService } from './konselor.service';

describe('KonselorService', () => {
  let service: KonselorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KonselorService],
    }).compile();

    service = module.get<KonselorService>(KonselorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
