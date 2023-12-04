import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { UserEntity } from './entities/user.entity';

import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createAdmin(createUserDto: CreateUserDto) {
    const encryptedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.users.create({
      data: {
        ...createUserDto,
        password: encryptedPassword,
        roles: [Role.Admin],
      },
    });

    return this.removePassword(user);
  }

  async create(createUserDto: CreateUserDto) {
    const encryptedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.users.create({
      data: {
        ...createUserDto,
        password: encryptedPassword,
        roles: [Role.User],
      },
    });

    return this.removePassword(user);
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

    if (!user) return null;

    return this.removePassword(user);
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
    if (updateUserDto.password != null) {
      const encryptedPassword = await bcrypt.hash(updateUserDto.password, 10);

      updateUserDto.password = encryptedPassword;
    }

    const user = await this.prisma.users.update({
      where: {
        id,
      },
      data: updateUserDto,
    });

    return this.removePassword(user);
  }

  async remove(id: string) {
    const user = await this.prisma.users.delete({
      where: {
        id,
      },
    });

    return this.removePassword(user);
  }

  private removePassword(user: UserEntity): UserEntity {
    return {
      ...user,
      password: null,
    };
  }
}
