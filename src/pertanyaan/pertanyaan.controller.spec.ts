import { Test, TestingModule } from '@nestjs/testing';
import { PertanyaanController } from './pertanyaan.controller';

describe('PertanyaanController', () => {
  let controller: PertanyaanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PertanyaanController],
    }).compile();

    controller = module.get<PertanyaanController>(PertanyaanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
