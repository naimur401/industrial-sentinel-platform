import { Test, TestingModule } from '@nestjs/testing';
import { AssetsService } from './assets.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AssetsService', () => {
  let service: AssetsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    asset: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
    facility: {
      findFirst: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AssetsService>(AssetsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of assets with facility', async () => {
      const mockAssets = [
        { id: 'asset-1', name: 'PUMP-001', facility: { name: 'Refinery' } },
        { id: 'asset-2', name: 'MOTOR-001', facility: { name: 'Refinery' } },
      ];
      mockPrismaService.asset.findMany.mockResolvedValue(mockAssets);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('PUMP-001');
    });
  });

  describe('getStats', () => {
    it('should return total assets and facilities count', async () => {
      mockPrismaService.asset.count.mockResolvedValue(30);
      mockPrismaService.facility.count.mockResolvedValue(2);

      const result = await service.getStats();

      expect(result.totalAssets).toBe(30);
      expect(result.totalFacilities).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return an asset if found', async () => {
      const mockAsset = { id: 'asset-1', name: 'PUMP-001' };
      mockPrismaService.asset.findUnique.mockResolvedValue(mockAsset);

      const result = await service.findOne('asset-1');

      expect(result.name).toBe('PUMP-001');
    });

    it('should throw NotFoundException if asset not found', async () => {
      mockPrismaService.asset.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow('Asset not found');
    });
  });
});
