import { Test, TestingModule } from '@nestjs/testing';
import { ArtikelController } from './artikel.controller';

describe('ArtikelController', () => {
  let controller: ArtikelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtikelController],
    }).compile();

    controller = module.get<ArtikelController>(ArtikelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
