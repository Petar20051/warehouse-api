import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { User } from './user.entity';
import { UserService } from './user.service';
import { BaseController } from 'src/common/controller/base.controller';
import {
  CreateUserDto,
  createUserSchema,
  UpdateUserDto,
  updateUserSchema,
} from './user.static';
import { ZodValidationPipe } from 'nestjs-zod';
import { IdParamDto, idParamSchema } from 'src/common/types/id-param.static';
import { User as UserDecorator } from 'src/auth/decorators/user.decorator';
import { AuthUser } from 'src/common/types/auth-user';

@ApiTags('Users')
@ApiBearerAuth('Authorization')
@Controller('users')
export class UserController extends BaseController<User> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  @Get()
  @ApiOperation({ summary: "Get all users for the current user's company" })
  findAll(@UserDecorator() user: AuthUser) {
    return super.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by ID' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  findOne(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParamDto,
    @UserDecorator() user: AuthUser,
  ) {
    return super.findOne(params, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Fields required to create a user',
    examples: {
      minimal: { value: { fullName: '', email: '', password: '', role: '' } },
    },
  })
  create(
    @Body(new ZodValidationPipe(createUserSchema)) dto: CreateUserDto,
    @UserDecorator() user: AuthUser,
  ) {
    return super.create(dto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Fields to update a user',
    examples: {
      empty: { value: { fullName: '', email: '', password: '', role: '' } },
    },
  })
  update(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParamDto,
    @Body(new ZodValidationPipe(updateUserSchema)) dto: UpdateUserDto,
    @UserDecorator() user: AuthUser,
  ) {
    return super.update(params, dto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  softDelete(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParamDto,
    @UserDecorator() user: AuthUser,
  ) {
    return super.softDelete(params, user);
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'Permanently delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  hardDelete(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParamDto,
    @UserDecorator() user: AuthUser,
  ) {
    return super.hardDelete(params, user);
  }
}
