import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { IdeaDTO, IdeaRO } from './idea.dto';
import { IdeaEntity } from './idea.entity';

@Injectable()
export class IdeaService {
    constructor(
        @InjectRepository(IdeaEntity)
        private ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) { }

    async showAll() {
        const ideas = await this.ideaRepository.find({ relations: ['author'] })
        return ideas.map(idea => this.toResponseObject(idea))
    }

    async create(userId: string, data: IdeaDTO): Promise<IdeaRO> {
        const user = await this.userRepository.findOne({ where: { id: userId } })
        const idea = this.ideaRepository.create({ ...data, author: user })
        await this.ideaRepository.save(idea)
        return this.toResponseObject(idea)
    }

    async read(id: string): Promise<IdeaRO> {
        const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] })
        if (!idea) throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        return this.toResponseObject(idea)
    }

    async update(id: string, userId: string, data: Partial<IdeaDTO>): Promise<IdeaRO> {
        let idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] })
        if (!idea) throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        this.ensureOwnership(idea, userId)
        await this.ideaRepository.update({ id }, data)
        idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] })
        return this.toResponseObject(idea)
    }

    async destroy(id: string, userId: string) {
        const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] })
        if (!idea) throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        this.ensureOwnership(idea, userId)
        await this.ideaRepository.delete({ id })
        return idea
    }

    private toResponseObject(idea: IdeaEntity): IdeaRO {
        if (idea.author !== null) {
            return { ...idea, author: idea.author.toResponseObject(false) }
        } else {
            return { ...idea, author: null }
        }
    }

    private ensureOwnership(idea: IdeaEntity, userId: string) {
        if (idea.author.id !== userId) {
            throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED)
        }
    }
}
