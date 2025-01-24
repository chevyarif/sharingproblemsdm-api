import { Test, TestingModule } from '@nestjs/testing';
import { KonselorController } from './konselor.controller';

describe('KonselorController', () => {
  let controller: KonselorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KonselorController],
    }).compile();

    controller = module.get<KonselorController>(KonselorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
