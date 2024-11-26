import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Post,
    Put,
    Request,
    UseGuards,
    ValidationPipe,
  } from '@nestjs/common';
  import { SETTINGS } from '../../app.utils';
  import { UserRegisterRequestDto } from './dto/user-register.req.dto';
  import { User } from './user.entity';
  import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserUpdateRequestDto } from './dto/user-update.req.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
  
  @Controller('user')
  export class UserController {
    constructor(private userService: UserService) {}
  
    @Post('/register')
    @ApiCreatedResponse({
        description: 'Created user object as response',
        type: User,
    })
    @ApiBadRequestResponse({
        description: 'User cannot register. Try again!'
    })
    async doUserRegistration(
      @Body(SETTINGS.VALIDATION_PIPE)
      userRegister: UserRegisterRequestDto,
    ): Promise<User> {
      return await this.userService.doUserRegistration(userRegister);
    }


    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({ status: 200, description: 'User deleted successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete('/delete')
    async delete(@Request() req): Promise<any> {
        return this.userService.delete(req.user.id);
    }

    @ApiOperation({ summary: 'Update user details' })
    @ApiResponse({ status: 200, description: 'User updated successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put('/update')
    @HttpCode(200)
    async update(
      @Request() req,
      @Body() updates: UserUpdateRequestDto,
    ): Promise<User> {
      const userId = req.user.id; // Extract user ID from JWT
      return this.userService.updateUser(userId, updates);
    }
  }