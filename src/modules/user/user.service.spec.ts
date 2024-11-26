import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserRegisterRequestDto } from './dto/user-register.req.dto';
import { UserUpdateRequestDto } from './dto/user-update.req.dto';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('./user.entity'); // Mock the User entity

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('doUserRegistration', () => {
    it('should register a new user', async () => {
      const userRegisterDto: UserRegisterRequestDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        confirm: 'password123',
      };

      const saveMock = jest.fn().mockResolvedValue({ ...userRegisterDto, id: 1 });
      User.prototype.save = saveMock;

      const result = await userService.doUserRegistration(userRegisterDto);

      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ...userRegisterDto, id: 1 });
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
      jest.spyOn(User, 'findOne').mockResolvedValue(user as User);

      const result = await userService.getUserByEmail('john.doe@example.com');

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'john.doe@example.com' } });
      expect(result).toEqual(user);
    });

    it('should return undefined if user is not found', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(undefined);

      const result = await userService.getUserByEmail('nonexistent@example.com');

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
      expect(result).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete a user by id', async () => {
      jest.spyOn(User, 'delete').mockResolvedValue({ affected: 1 } as any);

      await userService.delete(1);

      expect(User.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(User, 'delete').mockResolvedValue({ affected: 0 } as any);

      await expect(userService.delete(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const user = { id: 1, save: jest.fn().mockResolvedValue(true) } as unknown as User;
      const updates: UserUpdateRequestDto = { name: 'Updated Name', password: 'newpassword' };

      jest.spyOn(User, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword');

      const result = await userService.updateUser(1, updates);

      expect(User.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 'salt');
      expect(user.save).toHaveBeenCalled();
      expect(result.name).toEqual('Updated Name');
      expect(result.password).toEqual('hashedpassword');
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(undefined);

      await expect(userService.updateUser(999, { name: 'New Name' })).rejects.toThrow(NotFoundException);
    });
  });
});
