import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('../user/user.service'); // Mock UserService
jest.mock('@nestjs/jwt'); // Mock JwtService

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUserCreds', () => {
    it('should throw BadRequestException if user is not found', async () => {
      // Simulate no user found
      userService.getUserByEmail = jest.fn().mockResolvedValue(null);

      await expect(authService.validateUserCreds('test@example.com', 'password'))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const user = { id: 1, name: 'John Doe', email: 'test@example.com', password: 'hashedPassword' };

      // Simulate user found but password incorrect
      userService.getUserByEmail = jest.fn().mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await expect(authService.validateUserCreds('test@example.com', 'wrongPassword'))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should return user if credentials are valid', async () => {
      const user = { id: 1, name: 'John Doe', email: 'test@example.com', password: 'hashedPassword' };

      // Simulate user found and password matches
      userService.getUserByEmail = jest.fn().mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      const result = await authService.validateUserCreds('test@example.com', 'password');
      expect(result).toEqual(user);
    });
  });

  describe('generateToken', () => {
    it('should generate a valid token', () => {
      const user = { id: 1, name: 'John Doe' };

      // Simulate token generation
      jwtService.sign = jest.fn().mockReturnValue('mockedToken');

      const result = authService.generateToken(user);
      expect(result).toEqual({ access_token: 'mockedToken' });
      expect(jwtService.sign).toHaveBeenCalledWith({ name: user.name, sub: user.id });
    });
  });
});
