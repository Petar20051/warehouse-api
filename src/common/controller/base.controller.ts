import {
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { BaseService } from '../services/base.service';
import { AuthRequest } from '../types/auth-request';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/entities/user/user.static';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BaseController<T extends { id: string; companyId?: string }> {
  constructor(protected readonly service: BaseService<T>) {}

  @Get()
  @Roles(UserRole.VIEWER, UserRole.OPERATOR, UserRole.OWNER)
  findAll(@Req() req: AuthRequest) {
    return this.service.findAllByCompany(req.user.companyId);
  }

  @Get(':id')
  @Roles(UserRole.VIEWER, UserRole.OPERATOR, UserRole.OWNER)
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.service.findOne(id, req.user.companyId);
  }

  @Post()
  @Roles(UserRole.OPERATOR, UserRole.OWNER)
  create(@Body() dto: DeepPartial<T>, @Req() req: AuthRequest) {
    return this.service.createWithUserContext(dto, req.user);
  }

  @Patch(':id')
  @Roles(UserRole.OPERATOR, UserRole.OWNER)
  update(
    @Param('id') id: string,
    @Body() dto: DeepPartial<T>,
    @Req() req: AuthRequest,
  ) {
    return this.service.updateWithUserContext(id, dto, req.user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.OPERATOR, UserRole.OWNER)
  softDelete(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.service.softDelete(id, req.user.companyId);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.OWNER)
  hardDelete(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.service.hardDelete(id, req.user.companyId);
  }
}
