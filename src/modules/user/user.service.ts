import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRegisterRequestDto } from './dto/user-register.req.dto';
import { User } from './user.entity';
import { UserUpdateRequestDto } from './dto/user-update.req.dto';
import * as bcrypt from 'bcrypt';
import { log } from 'console';

@Injectable()
export class UserService {
  async doUserRegistration(
    userRegister: UserRegisterRequestDto,
  ): Promise<User> {
    const user = new User();
    user.name = userRegister.name;
    user.email = userRegister.email;
    user.password = userRegister.password;

    return await user.save();
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return User.findOne({ where: { email } });
  }

  
  async delete(id: number): Promise<void> {
    console.log(id);
    const result = await User.delete(id);
    
    if (result.affected === 0) throw new NotFoundException(`User with ID ${id} not found.`);
  }

  async updateUser(
    id: number,
    updates: UserUpdateRequestDto,
  ): Promise<User> {
    const user = await User.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found.`);

    if (updates.name) user.name = updates.name;
    if (updates.email) user.email = updates.email;
    if (updates.password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(updates.password, salt);
    }
    
    user.updatedAt = new Date(); // Update the `updatedAt` field

    await user.save(); // Save updated user data
    return user;
  }
}