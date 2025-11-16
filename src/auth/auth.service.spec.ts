import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const mockPrisma = {
  salesRep: {
    findUnique: jest.fn(),
  },
};

const mockJwt = {
  sign: jest.fn(() => 'fake-jwt-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login valid user', async () => {
    const hashed = await bcrypt.hash('adminpassword', 10);
    mockPrisma.salesRep.findUnique.mockResolvedValue({
      id: 1,
      username: 'admin',
      passwordHash: hashed,
      role: 'ADMIN',
    });

    const result = await service.login('admin', 'adminpassword');
    expect(result.access_token).toBe('fake-jwt-token');
  });

  it('should reject wrong password', async () => {
    const hashed = await bcrypt.hash('adminpassword', 10);
    mockPrisma.salesRep.findUnique.mockResolvedValue({
      passwordHash: hashed,
    });

    await expect(service.login('admin', 'wrong')).rejects.toThrow('Invalid credentials');
  });

  it('should reject unknown user', async () => {
    mockPrisma.salesRep.findUnique.mockResolvedValue(null);
    await expect(service.login('ghost', 'pass')).rejects.toThrow('Invalid credentials');
  });

  it('should return user without password', async () => {
    const hashed = await bcrypt.hash('pass', 10);
    mockPrisma.salesRep.findUnique.mockResolvedValue({
      id: 1,
      username: 'test',
      passwordHash: hashed,
      role: 'SALES_REP',
      name: 'Test',
    });

    const result = await service.validateUser('test', 'pass');
    expect(result).toEqual({
      id: 1,
      username: 'test',
      role: 'SALES_REP',
      name: 'Test',
    });
  });
});