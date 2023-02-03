import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export async function JwtOptionsFactory(
  configService: ConfigService,
): Promise<JwtModuleOptions> {
  return {
    secret: configService.get('JWT_SECRET'),
    signOptions: { expiresIn: '1800s' },
  };
}
