import { UsersService } from '../user/users.service';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AuthOnly } from '../../auth/guards/annotation-guard';
import { CreateRoleDto } from '../dto/create-role.dto';
import { CreatePermisionDto } from '../dto/create-permision.dto';

@Controller('role')
@AuthOnly()
export class RoleController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createRole(@Body() data: CreateRoleDto) {
    return this.userService.createRole(data);
  }

  @Get()
  async getRoleById() {
    return this.userService.findAllRoles();
  }

  @Delete('/:id')
  async removeRole(@Param('id') id: string) {
    return this.userService.removeRole(id);
  }

  @Post('/permission')
  async assignPermission(@Body() data: CreatePermisionDto) {
    return this.userService.createPermision(data);
  }

  @Delete('/permission/:userId/:roleId')
  async deletePermission(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.userService.deletePermission(userId, roleId);
  }
}
