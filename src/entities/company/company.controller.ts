import { Controller } from '@nestjs/common';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { BaseController } from 'src/common/controller/base.controller';

@Controller('companies')
export class CompanyController extends BaseController<Company> {
  constructor(private readonly companyService: CompanyService) {
    super(companyService);
  }
}
