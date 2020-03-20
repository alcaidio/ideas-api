import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdeaDTO } from './idea.dto';
import { Idea } from './idea.entity';

@Injectable()
export class IdeaService {
    constructor(
        @InjectRepository(Idea)
        private ideaRepository: Repository<Idea>
    ) { }

    async showAll() {
        return await this.ideaRepository.find()
    }

    async create(data: IdeaDTO) {
        const idea = this.ideaRepository.create(data)
        await this.ideaRepository.save(idea)
        return idea
    }

    async read(id: string) {
        const idea = await this.ideaRepository.findOne({ where: { id } })
        if (!idea) throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        return idea
    }

    async update(id: string, data: Partial<IdeaDTO>) {
        const idea = this.ideaRepository.findOne({ id })
        if (!idea) throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        await this.ideaRepository.update({ id }, data)
        return idea
    }

    async destroy(id: string) {
        const idea = this.ideaRepository.findOne({ id })
        if (!idea) throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        await this.ideaRepository.delete({ id })
        return idea
    }
}
