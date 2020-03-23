import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRO } from './user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) { }

    async showAll(): Promise<UserRO[]> {
        const users = await this.userRepository.find({ relations: ['ideas', 'bookmarks'] })
        return users.map(user => user.toResponseObject(false))
    }

    async show(id: string): Promise<UserRO> {
        const user = await this.userRepository.findOne({
            where: { id }, relations: ['ideas', 'bookmarks']
        })
        return user.toResponseObject()
    }

}
