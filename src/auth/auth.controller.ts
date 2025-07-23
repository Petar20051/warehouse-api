import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginSchema,
  RegisterSchema,
  RegisterUserToCompanySchema,
} from './auth.static';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new company and owner user' })
  @ApiBody({
    schema: {
      example: {
        companyName: 'Yara Inc',
        companyEmail: 'admin@yara.com',
        fullName: 'Petar Petrov',
        email: 'petar@yara.com',
        password: 'securePassword123',
      },
    },
  })
  async register(@Body() body: unknown) {
    const data = RegisterSchema.parse(body);
    return this.authService.register(data);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({
    schema: {
      example: {
        email: 'gosho@yara.com',
        password: 'viewer123',
      },
    },
  })
  async login(@Body() body: unknown) {
    const data = LoginSchema.parse(body);
    return this.authService.login(data);
  }

  @Post('register-user')
  @ApiOperation({
    summary: 'Register a user to an existing company (default: viewer)',
  })
  @ApiBody({
    schema: {
      example: {
        companyId: '57403e6c-ca90-4b2a-9222-f4b69d2207ca',
        fullName: 'Gosho Viewer',
        email: 'gosho@yara.com',
        password: 'viewer123',
      },
    },
  })
  async registerUser(@Body() body: unknown) {
    const data = RegisterUserToCompanySchema.parse(body);
    return this.authService.registerUserToCompany(data);
  }
}
