import { Test, TestingModule } from '@nestjs/testing';
import { ZeroTrustService } from './zero-trust.service';

describe('ZeroTrustService', () => {
  let service: ZeroTrustService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZeroTrustService],
    }).compile();

    service = module.get<ZeroTrustService>(ZeroTrustService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
