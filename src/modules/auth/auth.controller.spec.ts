import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            generateToken: jest.fn(), // Mock method
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should call AuthService.generateToken with user details', async () => {
      const mockUser = { id: 1, name: 'Test User' };
      const req = { user: mockUser };
      const loginDto: LoginDto = { username: 'test@example.com', password: 'password123' };

      // Explicitly type the mock return value
      (authService.generateToken as jest.Mock).mockResolvedValueOnce({ access_token: 'token' });

      const result = await authController.login(req, loginDto);

      expect(authService.generateToken).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ access_token: 'token' });
    });
  });
});
