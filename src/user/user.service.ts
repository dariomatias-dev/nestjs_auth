import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.users.create({
      data: createUserDto,
    });

    return user;
  }

  async findAll() {
    const users = await this.prisma.users.findMany();

    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.users.update({
      where: {
        id,
      },
      data: updateUserDto,
    });

    return user;
  }

  async remove(id: string) {
    const user = await this.prisma.users.delete({
      where: {
        id,
      },
    });

    return user;
  }
}
