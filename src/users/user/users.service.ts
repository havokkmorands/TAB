import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateRoleDto } from '../dto/create-role.dto';
import { CreatePermisionDto } from '../dto/create-permision.dto';
import { EntityNotFoundException } from '../../common/exceptions/entity-not-found-exception';
import { Address, Preferences, Role, User, UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    data: CreateUserDto,
    prisma: PrismaService = this.prisma,
  ): Promise<Partial<User>> {
    const hashPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        addresses: {
          where: { deleted: false },
          select: {
            id: true,
            street: true,
            number: true,
            city: true,
            state: true,
            country: true,
            county: true,
            zipCode: true,
          },
        },
      },
      data: {
        ...data,
        password: hashPassword,
        deleted: false,
        deletedEmail: '',
        addresses: {
          create: data.addresses.map((address: CreateAddressDto) => {
            return {
              street: address.street,
              number: address.number,
              city: address.city,
              state: address.state,
              country: address.country,
              county: address.county,
              zipCode: address.zipCode,
            };
          }),
        },
        preference: {
          create: {
            avatar:
              'https://media.discordapp.net/attachments/745551590676496415/1435392785552511044/profile.png?ex=690bcd34&is=690a7bb4&hm=c66cc235514ec5230611ff58addc628860b9c6a8d274322ceba22c26d83c4c9b&=&format=webp&quality=lossless&width=750&height=750',
          },
        },
      },
    });
  }

  async findAll(prisma: PrismaService = this.prisma): Promise<Partial<User>[]> {
    return prisma.user.findMany({
      where: { deleted: false },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findById(
    id: string,
    prisma: PrismaService = this.prisma,
  ): Promise<Partial<User>> {
    const user = await prisma.user.findUnique({
      where: { id, deleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        addresses: {
          where: { deleted: false },
          select: {
            id: true,
            street: true,
            number: true,
            city: true,
            state: true,
            country: true,
            county: true,
            zipCode: true,
          },
        },
        preference: true,
        userRoles: true,
      },
    });
    if (!user) {
      throw new EntityNotFoundException('User', [
        { fieldName: 'id', field: id },
      ]);
    }
    return user;
  }

  async retrieveById(
    id: string,
    prisma: PrismaService = this.prisma,
  ): Promise<Partial<User>> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        deleted: true,
        password: true,
        createdAt: true,
        deletedAt: true,
        deletedEmail: true,
        addresses: false,
        preference: false,
      },
    });
    if (!user) {
      throw new EntityNotFoundException('User', [
        { fieldName: 'id', field: id },
      ]);
    }
    return user;
  }

  async retrieveByEmail(
    email: string,
    prisma: PrismaService = this.prisma,
  ): Promise<Partial<User>> {
    const user = await prisma.user.findUnique({
      where: { email, deleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      throw new EntityNotFoundException('User', [
        { fieldName: 'email', field: email },
      ]);
    }
    return user;
  }

  async update(
    id: string,
    data: UpdateUserDto,
    prisma: PrismaService = this.prisma,
  ): Promise<Partial<User>> {
    return prisma.$transaction(async (_prisma: PrismaService) => {
      const user = await this.retrieveById(id, _prisma);
      if (
        await bcrypt.compare(data.confirmationPassword, user.password ?? '')
      ) {
        if (data.password) {
          user.password = await bcrypt.hash(data.password, 10);
        }
        if (data.name) {
          user.name = data.name;
        }
        if (data.email) {
          user.email = data.email;
        }
      }
      return _prisma.user.update({
        where: { id, deleted: false },
        data: user,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  }

  updateAddress(
    id: string,
    data: CreateAddressDto,
    prisma: PrismaService = this.prisma,
  ): Promise<Partial<Address>> {
    return prisma.$transaction(async (_prisma: PrismaService) => {
      const address = await _prisma.address.findUnique({
        where: { id, deleted: false },
      });
      if (!address) {
        throw new EntityNotFoundException('AddressEntity', [
          { fieldName: 'id', field: id },
        ]);
      }
      if (data.street) {
        address.street = data.street;
      }
      if (data.number) {
        address.number = data.number;
      }
      if (data.city) {
        address.city = data.city;
      }
      if (data.county) {
        address.county = data.county;
      }
      if (data.state) {
        address.state = data.state;
      }
      if (data.country) {
        address.country = data.country;
      }
      if (data.zipCode) {
        address.zipCode = data.zipCode;
      }
      return _prisma.address.update({
        where: { id, deleted: false },
        data: address,
        select: {
          street: true,
          number: true,
          county: true,
          state: true,
          country: true,
          zipCode: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  }

  addAddress(
    id: string,
    data: CreateAddressDto,
    prisma: PrismaService = this.prisma,
  ): Promise<Partial<Address>> {
    return prisma.$transaction(async (_prisma: PrismaService) => {
      await this.retrieveById(id, _prisma);
      return _prisma.address.create({
        data: {
          ...data,
          user: {
            connect: { id },
          },
        },
      });
    });
  }

  removeAddress(
    id: string,
    prisma: PrismaService = this.prisma,
  ): Promise<Partial<Address>> {
    return prisma.$transaction(async (_prisma: PrismaService) => {
      const address = await _prisma.address.findUnique({
        where: { id, deleted: false },
      });
      if (!address) {
        throw new EntityNotFoundException('AddressEntity', [
          { fieldName: 'id', field: id },
        ]);
      }
      const user = await this.findById(address.userId, _prisma);
      if (user?.preference?.mainAddressId === id) {
        user.preference.mainAddressId = null;
        await _prisma.preferences.update({
          where: { id: user.preference.id },
          data: { mainAddressId: null },
        });
      }
      return _prisma.address.update({
        where: { id, deleted: false },
        data: { deleted: true, deletedAt: new Date() },
        select: {
          deletedAt: true,
        },
      });
    });
  }

  removeUser(
    id: string,
    prisma: PrismaService = this.prisma,
  ): Promise<Partial<User>> {
    return prisma.$transaction(async (_prisma: PrismaService) => {
      const user = await this.retrieveById(id, _prisma);
      const addresses = await this.getAddresses(id, _prisma);
      for (let i = addresses.length - 1; i >= 0; i--) {
        await this.removeAddress(addresses[i].id, _prisma);
      }
      user.deleted = true;
      user.deletedEmail = user.email;
      user.email = null;
      user.deletedAt = new Date();
      return _prisma.user.update({
        where: { id, deleted: false },
        data: user,
        select: {
          deletedAt: true,
        },
      });
    });
  }

  async getAddresses(
    id: string,
    prisma: PrismaService = this.prisma,
  ): Promise<Partial<Address>[]> {
    const addresses = await prisma.address.findMany({
      where: { deleted: false, userId: id },
      select: {
        id: true,
        street: true,
        number: true,
        city: true,
        state: true,
        country: true,
        county: true,
      },
    });
    if (!addresses) {
      throw new EntityNotFoundException('AddressEntity', [
        { fieldName: 'id', field: id },
      ]);
    }
    return addresses;
  }

  createRole(
    data: CreateRoleDto,
    prisma: PrismaService = this.prisma,
  ): Promise<Partial<Role>> {
    return prisma.role.create({
      data,
    });
  }

  async getRoleById(
    id: string,
    prisma: PrismaService = this.prisma,
  ): Promise<Partial<Role>> {
    const role = await prisma.role.findUnique({
      where: { id, deleted: false },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!role) {
      throw new EntityNotFoundException('Role', [
        { fieldName: 'id', field: id },
      ]);
    }
    return role;
  }

  removeRole(
    id: string,
    prisma: PrismaService = this.prisma,
  ): Promise<Partial<Role>> {
    return prisma.role.update({
      where: { id, deleted: false },
      data: { deleted: true, deletedAt: new Date() },
      select: {
        deletedAt: true,
      },
    });
  }

  createPermision(
    data: CreatePermisionDto,
    prisma: PrismaService = this.prisma,
  ): Promise<Partial<UserRole>> {
    return prisma.$transaction(async (_prisma: PrismaService) => {
      const role = await this.getRoleById(data.roleId, _prisma);
      await this.retrieveById(data.userId, _prisma);
      await this.retrieveById(data.assignedBy, _prisma);

      return _prisma.userRole.create({
        data: {
          userId: data.userId,
          assignedBy: data.assignedBy,
          roleId: data.roleId,
          roleName: role.name,
          assignedAt: new Date(),
          description: data.description,
        },
      });
    });
  }

  deletePermission(
    userId: string,
    roleId: string,
    prisma: PrismaService = this.prisma,
  ): Promise<Partial<UserRole>> {
    return prisma.userRole.delete({
      where: { userId_roleId: { userId, roleId } },
    });
  }

  findAllRoles(prisma: PrismaService = this.prisma): Promise<Partial<Role>[]> {
    return prisma.role.findMany({
      where: { deleted: false },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
