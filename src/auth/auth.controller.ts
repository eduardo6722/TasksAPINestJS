import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthCredencialsDto } from './dto/auth-credencials.dto';
import { AuthService } from './auth.service';
import { JwtPayload } from './jwt-payload.interface';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(
    @Body(ValidationPipe) authCredencialsDto: AuthCredencialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredencialsDto);
  }

  @Post('signin')
  signIn(
    @Body() authCredencialsDto: AuthCredencialsDto,
  ): Promise<{ acessToken: string }> {
    return this.authService.signIn(authCredencialsDto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log(user);
  }
}
