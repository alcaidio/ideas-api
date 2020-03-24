import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRO } from 'src/user/user.dto';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Votes } from './../shared/votes.enum';
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

    private PAGINATION: number = 25

    async showAll(page: number = 1, newest?: boolean): Promise<IdeaRO[]> {
        const ideas = await this.ideaRepository.find({
            relations: ['author', 'upvotes', 'downvotes', 'comments'],
            take: this.PAGINATION,
            skip: this.PAGINATION * (page - 1),
            order: newest && { created: 'DESC' }
        })
        return ideas.map(idea => this.toResponseObject(idea))
    }

    async create(userId: string, data: IdeaDTO): Promise<IdeaRO> {
        const user = await this.userRepository.findOne({ where: { id: userId } })
        const idea = this.ideaRepository.create({ ...data, author: user })
        await this.ideaRepository.save(idea)
        return this.toResponseObject(idea)
    }

    async read(id: string): Promise<IdeaRO> {
        const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author', 'upvotes', 'downvotes', 'comments'] })
        if (!idea) throw new HttpException('Idea not found', HttpStatus.NOT_FOUND)
        return this.toResponseObject(idea)
    }

    async update(id: string, userId: string, data: Partial<IdeaDTO>): Promise<IdeaRO> {
        let idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] })
        if (!idea) throw new HttpException('Idea not found', HttpStatus.NOT_FOUND)
        this.ensureOwnership(idea, userId)
        await this.ideaRepository.update({ id }, data)
        idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author', 'comments'] })
        return this.toResponseObject(idea)
    }

    async destroy(id: string, userId: string): Promise<IdeaRO> {
        const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author', 'comments'] })
        if (!idea) throw new HttpException('Idea not found', HttpStatus.NOT_FOUND)
        this.ensureOwnership(idea, userId)
        await this.ideaRepository.delete({ id })
        return this.toResponseObject(idea)
    }

    async upvote(id: string, userId: string) {
        let idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author', 'upvotes', 'downvotes', 'comments'] })
        const user = await this.userRepository.findOne({ where: { id: userId } })
        idea = await this.vote(idea, user, Votes.UP)
        return this.toResponseObject(idea)
    }

    async downvote(id: string, userId: string) {
        let idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author', 'upvotes', 'downvotes', 'comments'] })
        const user = await this.userRepository.findOne({ where: { id: userId } })
        idea = await this.vote(idea, user, Votes.DOWN)
        return this.toResponseObject(idea)
    }

    async bookmark(id: string, userId: string): Promise<UserRO> {
        const idea = await this.ideaRepository.findOne({ where: { id } })
        const user = await this.userRepository.findOne({ where: { userId }, relations: ['bookmarks'] })
        if (!idea) throw new HttpException('Idea not found', HttpStatus.NOT_FOUND)
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length < 1) {
            user.bookmarks.push(idea)
            await this.userRepository.save(user)
        } else {
            throw new HttpException('Idea already bookmarked', HttpStatus.BAD_REQUEST)
        }
        return user.toResponseObject()
    }

    async unbookmark(id: string, userId: string): Promise<UserRO> {
        const idea = await this.ideaRepository.findOne({ where: { id } })
        const user = await this.userRepository.findOne({ where: { userId }, relations: ['bookmarks'] })
        if (!idea) throw new HttpException('Idea not found', HttpStatus.NOT_FOUND)
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length > 0) {
            user.bookmarks = user.bookmarks.filter(bookmark => bookmark.id !== idea.id)
            await this.userRepository.save(user)
        } else {
            throw new HttpException('It is impossible to unbookmarked an idea that did not bookmarked', HttpStatus.BAD_REQUEST)
        }
        return user.toResponseObject()
    }

    private toResponseObject(idea: IdeaEntity): IdeaRO {
        let author = null // TODO à enlever une fois bdd réinitialisé car author à null c'est impossible
        idea.author !== null ? author = idea.author.toResponseObject(false) : author
        const rO: any = { ...idea, author: author }
        if (rO.upvotes) rO.upvotes = idea.upvotes.length
        if (rO.downvotes) rO.downvotes = idea.downvotes.length
        return rO
    }

    private ensureOwnership(idea: IdeaEntity, userId: string) {
        if (idea.author.id !== userId) {
            throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED)
        }
    }

    private async vote(idea: IdeaEntity, user: UserEntity, vote: Votes) {
        const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP
        const voteLength = idea[vote].filter(voter => voter.id === user.id).length
        const oppositeLength = idea[opposite].filter(voter => voter.id === user.id).length

        if (voteLength < 1 && oppositeLength < 1) {
            idea[vote].push(user)
            await this.ideaRepository.save(idea)
        } else if (voteLength > 0 && oppositeLength < 1) {
            idea[vote] = idea[vote].filter(voter => voter.id !== user.id)
            await this.ideaRepository.save(idea)
        } else if (voteLength < 1 && oppositeLength > 0) {
            idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id)
            await this.ideaRepository.save(idea)
        } else {
            throw new HttpException('Unable to cast vote', HttpStatus.BAD_REQUEST)
        }

        return idea
    }
}
