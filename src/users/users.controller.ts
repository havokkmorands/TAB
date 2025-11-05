import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePermisionDto } from './dto/create-permision.dto';
import { AuthOnly, GuestOnly, NeededPermissions } from 'src/auth/guards/annotation-guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  @NeededPermissions('DEV')
  listAll() {
    return this.userService.findAll();
  }

  @Post()
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.userService.removeUser(id);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @Post('/address/:id')
  addAddress(@Param('id') id: string, @Body() data: CreateAddressDto) {
    return this.userService.addAddress(id, data);
  }

  @Patch('/address/:addressId')
  updateAddress(
    @Param('addressId') addressId: string,
    @Body() data: CreateAddressDto,
  ) {
    return this.userService.updateAddress(addressId, data);
  }

  @Delete('/address/:addressId')
  removeAddress(@Param('addressId') addressId: string) {
    return this.userService.removeAddress(addressId);
  }

  @Post('/print/:id')
  async printUser(@Param('id') id: string) {
    console.log(await this.userService.findById(id));
  }
}
