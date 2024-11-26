import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRegisterRequestDto } from './dto/user-register.req.dto';
import { UserUpdateRequestDto } from './dto/user-update.req.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

// Mock data
const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedpassword',
  save: jest.fn(),
};

// Mock UserService
const mockUserService = {
  doUserRegistration: jest.fn(),
  delete: jest.fn(),
  updateUser: jest.fn(),
};

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          request.user = { id: 1 }; // Mock user extracted from JWT
          return true;
        },
      })
      .compile();

    userController = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('doUserRegistration', () => {
    it('should register a user and return the created user', async () => {
      const dto: UserRegisterRequestDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirm: 'password123'
      };

      mockUserService.doUserRegistration.mockResolvedValue(mockUser);

      const result = await userController.doUserRegistration(dto);
      expect(result).toEqual(mockUser);
      expect(mockUserService.doUserRegistration).toHaveBeenCalledWith(dto);
    });
  });

  describe('delete', () => {
    it('should delete a user by ID', async () => {
      mockUserService.delete.mockResolvedValue(undefined);

      const result = await userController.delete({ user: { id: 1 } });
      expect(result).toBeUndefined();
      expect(mockUserService.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      const dto: UserUpdateRequestDto = {
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'newpassword',
      };

      mockUserService.updateUser.mockResolvedValue({ ...mockUser, ...dto });

      const result = await userController.update({ user: { id: 1 } }, dto);
      expect(result).toEqual({ ...mockUser, ...dto });
      expect(mockUserService.updateUser).toHaveBeenCalledWith(1, dto);
    });
  });
});
