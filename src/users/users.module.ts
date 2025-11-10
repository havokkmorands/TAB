import { Module } from '@nestjs/common';
import { UsersService } from './user/users.service';
import { UsersController } from './user/users.controller';
import { RoleController } from './role/role.controller';

@Module({
  providers: [UsersService],
  controllers: [UsersController, RoleController],
  exports: [UsersService],
})
export class UsersModule {}
