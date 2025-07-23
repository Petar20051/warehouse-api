import { Controller } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { BaseController } from 'src/common/controller/base.controller';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('Authorization')
@Controller('users')
export class UserController extends BaseController<User> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}
