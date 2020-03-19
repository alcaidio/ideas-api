import { Injectable } from '@nestjs/common';
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
        return await this.ideaRepository.findOne({ where: { id } })
    }

    async update(id: string, data: Partial<IdeaDTO>) {
        await this.ideaRepository.update({ id }, data)
        return await this.ideaRepository.findOne({ id })
    }

    async destroy(id: string) {
        await this.ideaRepository.delete({ id })
        return { deleted: true }
    }
}
