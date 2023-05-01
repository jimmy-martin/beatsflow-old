import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    try {
      const hashedPassword = await argon2.hash(registerDto.password);
      const newUser = this.usersRepository.create({
        email: registerDto.email,
        password: hashedPassword,
        username: registerDto.username,
      });

      const id = (await this.usersRepository.save(newUser)).id;
      const user = await this.usersRepository.findOneBy({ id });

      if (!user) throw new NotFoundException(`User #${id} not found`);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'password', 'username', 'role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await argon2.verify(
      user.password,
      loginDto.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...jwtUser } = user;

    const payload = { email: user.email, sub: user.id };
    const refresh_token = await this.generateRefreshToken(user);

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token,
      user: jwtUser,
    };
  }

  async generateRefreshToken(user: User): Promise<string> {
    const payload = { sub: user.id };
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: jwtConstants.refreshTokenExpiresIn,
    });
    return refreshToken;
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);

      const user = await this.usersRepository.findOneBy({ id: payload.sub });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = await this.jwtService.signAsync({
        email: user.email,
        sub: user.id,
      });

      return {
        access_token: newAccessToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
