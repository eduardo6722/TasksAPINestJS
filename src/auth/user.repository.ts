import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredencialsDto } from './dto/auth-credencials.dto';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredencialsDto: AuthCredencialsDto): Promise<void> {
    const { username, password } = authCredencialsDto;

    const exists = await this.findOne({ username });

    if (exists) {
      throw new BadRequestException(`User already exists`);
    } else {
      const salt = await bcrypt.genSalt();

      const user = new User();
      user.username = username;
      user.salt = salt;
      user.password = await this.hashPassword(password, salt);

      await user.save();
    }
  }

  async validateUserPassword(
    authCredencialsDto: AuthCredencialsDto,
  ): Promise<User> {
    const { username, password } = authCredencialsDto;

    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
