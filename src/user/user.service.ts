import { Injectable, ConflictException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';

export type User = any;

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOne(username: string): Promise<UserEntity> {
    return this.userRepository.findUserDetailsByUsername(username);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email } = createUserDto;
    const existingUser = await this.userRepository.findOneBy({ email });

    if (existingUser) {
      // If a user with the same email already exists, throw a conflict exception
      throw new ConflictException('Email already exists.');
    }

    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.createUser(user);
  }
}
