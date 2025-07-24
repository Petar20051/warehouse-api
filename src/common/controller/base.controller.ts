import { Param, Body, UseGuards } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { BaseService } from '../services/base.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/entities/user/user.static';
import { ApiBearerAuth } from '@nestjs/swagger';
import { IdParamDto, idParamSchema } from '../types/id-param.static';
import { ZodValidationPipe } from 'nestjs-zod';
import { User } from 'src/auth/decorators/user.decorator';
import { AuthUser } from '../types/auth-user';

@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BaseController<T extends { id: string; companyId?: string }> {
  constructor(protected readonly service: BaseService<T>) {}

  findAll(@User() user: AuthUser) {
    return this.service.findAllByCompany(user.companyId);
  }

  findOne(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParamDto,
    @User() user: AuthUser,
  ) {
    return this.service.findOne(params.id, user.companyId);
  }

  @Roles(UserRole.OPERATOR, UserRole.OWNER)
  create(@Body() dto: DeepPartial<T>, @User() user: AuthUser) {
    return this.service.createWithUserContext(dto, user);
  }

  @Roles(UserRole.OPERATOR, UserRole.OWNER)
  update(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParamDto,
    @Body() dto: DeepPartial<T>,
    @User() user: AuthUser,
  ) {
    return this.service.updateWithUserContext(params.id, dto, user);
  }

  @Roles(UserRole.OPERATOR, UserRole.OWNER)
  softDelete(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParamDto,
    @User() user: AuthUser,
  ) {
    return this.service.softDelete(params.id, user.companyId);
  }

  @Roles(UserRole.OWNER)
  hardDelete(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParamDto,
    @User() user: AuthUser,
  ) {
    return this.service.hardDelete(params.id, user.companyId);
  }
}
