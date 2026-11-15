import { Test, TestingModule } from '@nestjs/testing';
import { ZeroTrustController } from './zero-trust.controller';

describe('ZeroTrustController', () => {
  let controller: ZeroTrustController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZeroTrustController],
    }).compile();

    controller = module.get<ZeroTrustController>(ZeroTrustController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
