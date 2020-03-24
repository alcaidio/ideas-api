import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaEntity } from 'src/idea/idea.entity';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CommentDTO, CommentRO } from './comment.dto';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private commentRepository: Repository<CommentEntity>,
        @InjectRepository(IdeaEntity)
        private ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }

    private PAGINATION: number = 5

    async showAll(): Promise<CommentRO[]> {
        const comments = await this.commentRepository.find()
        if (!comments) throw new HttpException('Comments not found', HttpStatus.NOT_FOUND)
        if (comments.length < 1) console.error('Comment exist but is null')
        return comments.map(comment => this.toResponseObject(comment))
    }

    async show(id: string): Promise<CommentRO> {
        const comment = await this.commentRepository.findOne({ where: { id }, relations: ['author', 'idea'] })
        if (!comment) throw new HttpException('Comment not found', HttpStatus.NOT_FOUND)
        return this.toResponseObject(comment)
    }

    async showByIdea(id: string, page: number = 1): Promise<CommentRO[]> {
        const comments = await this.commentRepository.find({
            where: { idea: { id } },
            relations: ['author'],
            take: this.PAGINATION,
            skip: this.PAGINATION * (page - 1)
        })
        if (!comments) throw new HttpException('Comments not found for this idea', HttpStatus.NOT_FOUND)
        return comments.map(comment => this.toResponseObject(comment))
    }

    async showByUser(id: string, page: number = 1): Promise<CommentRO[]> {
        const comments = await this.commentRepository.find({
            where: { author: { id } },
            relations: ['author'],
            take: this.PAGINATION,
            skip: this.PAGINATION * (page - 1)
        })
        if (!comments) throw new HttpException('Comments not found for this user', HttpStatus.NOT_FOUND)
        return comments.map(comment => this.toResponseObject(comment))
    }

    async create(ideaId: string, userId: string, data: CommentDTO): Promise<CommentRO> {
        const idea = await this.ideaRepository.findOne({ where: { id: ideaId } })
        if (!idea) throw new HttpException('Idea not found', HttpStatus.NOT_FOUND)
        const user = await this.userRepository.findOne({ where: { id: userId } })
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        const comment = this.commentRepository.create({ ...data, idea, author: user })
        await this.commentRepository.save(comment)
        return this.toResponseObject(comment)
    }

    async destroy(commentId: string, userId: string): Promise<CommentRO> {
        const comment = await this.commentRepository.findOne({ where: { id: commentId }, relations: ['author', 'idea'] })
        if (!comment) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        if (comment.author.id !== userId) throw new HttpException('You do not own this comment', HttpStatus.UNAUTHORIZED)
        await this.commentRepository.remove(comment)
        return this.toResponseObject(comment)
    }

    private toResponseObject(comment: CommentEntity): CommentRO {
        const rO: any = comment
        if (rO.author) rO.author = comment.author.toResponseObject()
        return rO
    }



}
