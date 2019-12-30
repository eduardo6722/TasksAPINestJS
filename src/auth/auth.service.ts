import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'crypto';
import { AuthCredencialsDto } from './dto/auth-credencials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  signUp(authCredencialsDto: AuthCredencialsDto): Promise<{}> {
    return this.userRepository.signUp(authCredencialsDto);
  }

  async signIn(authCredencialsDto: AuthCredencialsDto): Promise<{}> {
    const user: User = await this.userRepository.validateUserPassword(
      authCredencialsDto,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { id: user.id, username: user.username };
    const accessToken: string = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
