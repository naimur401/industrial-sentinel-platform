import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password hash if credentials are valid', async () => {
      const password = 'test123';
      const passwordHash = await bcrypt.hash(password, 10);
      
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test User',
        passwordHash: passwordHash,
        organizationId: 'org-1',
      });

      const result = await service.validateUser('test@test.com', password);

      expect(result).toBeDefined();
      expect(result.email).toBe('test@test.com');
      expect(result.passwordHash).toBeUndefined();
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser('notfound@test.com', 'password');

      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const passwordHash = await bcrypt.hash('correct-password', 10);
      
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        passwordHash: passwordHash,
      });

      const result = await service.validateUser('test@test.com', 'wrong-password');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user info', async () => {
      const user = {
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test User',
        organizationId: 'org-1',
      };

      const result = await service.login(user);

      expect(result.access_token).toBe('mock_token');
      expect(result.user.id).toBe('user-1');
      expect(result.user.email).toBe('test@test.com');
    });
  });
});
