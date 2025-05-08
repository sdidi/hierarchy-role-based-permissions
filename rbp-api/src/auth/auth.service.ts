import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService,  @InjectRepository(User)
    private readonly userRepository: Repository<User>,) { }

    async validateUser(username: string, password: string): Promise<any> {
        const storedUsername = username;

        const user = await this.userRepository.findOne({ where: { name: username } });

        if (!user) {
            return null;
          }
      
        const isPasswordValid = await bcrypt.compare(password, user?.password);
        const id = user.id; 
        if (username === storedUsername && isPasswordValid) {
            return { id, username };
        }

        return null;
    }

    async login(user: any) {
        console.log('username:', user.username);
        console.log('sub:', user.id);
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
