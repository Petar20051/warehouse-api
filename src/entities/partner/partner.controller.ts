import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { BaseController } from 'src/common/controller/base.controller';
import { Partner } from './partner.entity';
import { PartnerService } from './partner.service';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  CreatePartnerDto,
  createPartnerSchema,
  UpdatePartnerDto,
  updatePartnerSchema,
} from './partner.static';
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

@ApiTags('Partners')
@ApiBearerAuth('Authorization')
@Controller('partners')
export class PartnerController extends BaseController<Partner> {
  constructor(private readonly partnerService: PartnerService) {
    super(partnerService);
  }

  @Get()
  @ApiOperation({ summary: "Get all partners for the current user's company" })
  findAll(@User() user: AuthUser) {
    return super.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single partner by ID' })
  @ApiParam({ name: 'id', description: 'Partner UUID' })
  findOne(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParamDto,
    @User() user: AuthUser,
  ) {
    return super.findOne(params, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new partner' })
  @ApiBody({
    type: CreatePartnerDto,
    description: 'Fields required to create a partner',
    examples: {
      minimal: {
        value: {
          name: '',
          type: '',
          email: '',
          phone: '',
          address: '',
          companyId: '',
        },
      },
    },
  })
  create(
    @Body(new ZodValidationPipe(createPartnerSchema)) dto: CreatePartnerDto,
    @User() user: AuthUser,
  ) {
    return super.create(dto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a partner by ID' })
  @ApiParam({ name: 'id', description: 'Partner UUID' })
  @ApiBody({
    type: UpdatePartnerDto,
    description: 'Fields to update a partner',
    examples: {
      empty: {
        value: {
          name: '',
          type: '',
          email: '',
          phone: '',
          address: '',
          companyId: '',
        },
      },
    },
  })
  update(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParamDto,
    @Body(new ZodValidationPipe(updatePartnerSchema)) dto: UpdatePartnerDto,
    @User() user: AuthUser,
  ) {
    return super.update(params, dto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a partner by ID' })
  @ApiParam({ name: 'id', description: 'Partner UUID' })
  softDelete(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParamDto,
    @User() user: AuthUser,
  ) {
    return super.softDelete(params, user);
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'Permanently delete a partner by ID' })
  @ApiParam({ name: 'id', description: 'Partner UUID' })
  hardDelete(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParamDto,
    @User() user: AuthUser,
  ) {
    return super.hardDelete(params, user);
  }
}
