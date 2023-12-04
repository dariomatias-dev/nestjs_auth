import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { UserService } from './user.service';

import { UUIDParamDto } from 'src/common/dto/uuid-param.dto';

import { IsPublic } from 'src/decorators/is-public.decorator';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post('user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('users')
  findAll() {
    return this.userService.findAll();
  }

  @Get('user/:id')
  findOne(@Param() { id }: UUIDParamDto) {
    return this.userService.findOne(id);
  }

  @Patch('user/:id')
  update(@Param() { id }: UUIDParamDto, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete('user/:id')
  remove(@Param() { id }: UUIDParamDto) {
    return this.userService.remove(id);
  }
}
