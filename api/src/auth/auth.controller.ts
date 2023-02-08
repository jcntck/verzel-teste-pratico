import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { ApiBody } from '@nestjs/swagger/dist/decorators';
import { LoginDto } from './dto/login.dto';

@Controller('api/v1/auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    description: 'Login na API',
    type: LoginDto,
  })
  login(@Request() req: any) {
    return this.authService.login(req.user);
  }
}
