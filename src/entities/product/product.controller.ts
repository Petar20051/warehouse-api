import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { BaseController } from 'src/common/controller/base.controller';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  CreateProductDto,
  createProductSchema,
  UpdateProductDto,
  updateProductSchema,
} from './product.static';
import { IdParamDto, idParamSchema } from 'src/common/types/id-param.static';
import { User } from 'src/auth/decorators/user.decorator';
import { AuthUser } from 'src/common/types/auth-user';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Products')
@ApiBearerAuth('Authorization')
@Controller('products')
export class ProductController extends BaseController<Product> {
  constructor(private readonly productService: ProductService) {
    super(productService);
  }

  @Get()
  @ApiOperation({ summary: "Get all products for the current user's company" })
  findAll(@User() user: AuthUser) {
    return super.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single product by ID' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  findOne(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParamDto,
    @User() user: AuthUser,
  ) {
    return super.findOne(params, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({
    type: CreateProductDto,
    description: 'Fields required to create a product',
    examples: {
      minimal: { value: { name: '', sku: '', productType: '', basePrice: 0 } },
    },
  })
  create(
    @Body(new ZodValidationPipe(createProductSchema)) dto: CreateProductDto,
    @User() user: AuthUser,
  ) {
    return super.create(dto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiBody({
    type: UpdateProductDto,
    description: 'Fields to update an existing product',
    examples: {
      empty: { value: { name: '', sku: '', productType: '', basePrice: 0 } },
    },
  })
  update(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParamDto,
    @Body(new ZodValidationPipe(updateProductSchema)) dto: UpdateProductDto,
    @User() user: AuthUser,
  ) {
    return super.update(params, dto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a product by ID' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  softDelete(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParamDto,
    @User() user: AuthUser,
  ) {
    return super.softDelete(params, user);
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'Permanently delete a product by ID' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  hardDelete(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParamDto,
    @User() user: AuthUser,
  ) {
    return super.hardDelete(params, user);
  }
}
