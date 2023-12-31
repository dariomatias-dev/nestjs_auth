import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { UserService } from './user.service';

import { RolesGuard } from 'src/auth/guards/roles.guard';
import { TokenIdMatchGuard } from 'src/auth/guards/token-id-match.guard';

import { UUIDParamDto } from 'src/common/dto/uuid-param.dto';

import { IsPublic } from 'src/decorators/is-public.decorator';
import { Roles } from 'src/decorators/roles.decorator';

import { Role } from 'src/enums/role.enum';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Post('admin-user')
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto, [Role.Admin]);
  }

  @IsPublic()
  @Post('user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto, [Role.User]);
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get('users')
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(TokenIdMatchGuard)
  @Get('user/:id')
  findOne(@Param() { id }: UUIDParamDto) {
    return this.userService.findOne(id);
  }

  @UseGuards(TokenIdMatchGuard)
  @Patch('user/:id')
  update(@Param() { id }: UUIDParamDto, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(TokenIdMatchGuard)
  @Delete('user/:id')
  remove(@Param() { id }: UUIDParamDto) {
    return this.userService.remove(id);
  }
}
