import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginSchema,
  RegisterSchema,
  RegisterUserToCompanySchema,
} from './auth.static';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from 'src/entities/user/user.static';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new company and owner user' })
  @ApiBody({
    schema: {
      example: {
        companyName: '',
        companyEmail: '',
        fullName: '',
        email: '',
        password: '',
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
        email: '',
        password: '',
      },
    },
  })
  async login(@Body() body: unknown) {
    const data = LoginSchema.parse(body);
    return this.authService.login(data);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.OWNER)
  @Post('register-user')
  @ApiOperation({
    summary: 'Register a user to an existing company (default: viewer)',
  })
  @ApiBody({
    schema: {
      example: {
        companyId: '',
        fullName: '',
        email: '',
        password: '',
      },
    },
  })
  async registerUser(@Body() body: unknown) {
    const data = RegisterUserToCompanySchema.parse(body);
    return this.authService.registerUserToCompany(data);
  }
}
