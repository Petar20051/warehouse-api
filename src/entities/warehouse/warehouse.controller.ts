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
import { Warehouse } from './warehouse.entity';
import { WarehouseService } from './warehouse.service';
import { BaseController } from 'src/common/controller/base.controller';
import {
  CreateWarehouseDto,
  createWarehouseSchema,
  UpdateWarehouseDto,
  updateWarehouseSchema,
} from './warehouse.static';
import { ZodValidationPipe } from 'nestjs-zod';
import { IdParamDto, idParamSchema } from 'src/common/types/id-param.static';
import { User } from 'src/auth/decorators/user.decorator';
import { AuthUser } from 'src/common/types/auth-user';

@ApiTags('Warehouses')
@ApiBearerAuth('Authorization')
@Controller('warehouses')
export class WarehouseController extends BaseController<Warehouse> {
  constructor(private readonly warehouseService: WarehouseService) {
    super(warehouseService);
  }

  @Get()
  @ApiOperation({
    summary: "Get all warehouses for the current user's company",
  })
  findAll(@User() user: AuthUser) {
    return super.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single warehouse by ID' })
  @ApiParam({ name: 'id', description: 'Warehouse UUID' })
  findOne(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParamDto,
    @User() user: AuthUser,
  ) {
    return super.findOne(params, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new warehouse' })
  @ApiBody({
    type: CreateWarehouseDto,
    description: 'Fields required to create a warehouse',
    examples: {
      minimal: { value: { name: '', location: '', supportedType: '' } },
    },
  })
  create(
    @Body(new ZodValidationPipe(createWarehouseSchema)) dto: CreateWarehouseDto,
    @User() user: AuthUser,
  ) {
    return super.create(dto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a warehouse by ID' })
  @ApiParam({ name: 'id', description: 'Warehouse UUID' })
  @ApiBody({
    type: UpdateWarehouseDto,
    description: 'Fields to update an existing warehouse',
    examples: {
      empty: { value: { name: '', location: '', supportedType: '' } },
    },
  })
  update(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParamDto,
    @Body(new ZodValidationPipe(updateWarehouseSchema)) dto: UpdateWarehouseDto,
    @User() user: AuthUser,
  ) {
    return super.update(params, dto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a warehouse by ID' })
  @ApiParam({ name: 'id', description: 'Warehouse UUID' })
  softDelete(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParamDto,
    @User() user: AuthUser,
  ) {
    return super.softDelete(params, user);
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'Permanently delete a warehouse by ID' })
  @ApiParam({ name: 'id', description: 'Warehouse UUID' })
  hardDelete(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParamDto,
    @User() user: AuthUser,
  ) {
    return super.hardDelete(params, user);
  }
}
