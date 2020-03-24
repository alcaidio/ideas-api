import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/shared/user.decorator';
import { CustomValidationPipe } from '../shared/custom-validation.pipe';
import { IdeaDTO } from './idea.dto';
import { IdeaService } from './idea.service';

@Controller('api/ideas')
export class IdeaController {

    constructor(private ideaService: IdeaService) { }

    @Get()
    showAllIdeas(@Query('page') page: number) {
        return this.ideaService.showAll(page)
    }

    @Get('newest')
    showNewestIdeas(@Query('page') page: number) {
        return this.ideaService.showAll(page, true)
    }

    @Post()
    @UseGuards(new AuthGuard())
    @UsePipes(new CustomValidationPipe())
    createIdea(@User('id') userId: string, @Body() data: IdeaDTO) {
        this.logData({ userId, data })
        return this.ideaService.create(userId, data)
    }

    @Get(':id')
    readIdea(@Param('id') id: string) {
        return this.ideaService.read(id)
    }

    @Put(':id')
    @UseGuards(new AuthGuard())
    @UsePipes(new CustomValidationPipe())
    updateIdea(
        @Param('id') id: string,
        @User('id') userId: string,
        @Body() data: Partial<IdeaDTO>) {
        this.logData({ id, userId, data })
        return this.ideaService.update(id, userId, data)
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    detroyIdea(@Param('id') id: string, @User('id') userId: string) {
        this.logData({ id, userId })
        return this.ideaService.destroy(id, userId)
    }

    @Post(':id/upvote')
    @UseGuards(new AuthGuard())
    upvoteIdea(@Param('id') id: string, @User('id') userId: string) {
        this.logData({ id, userId })
        return this.ideaService.upvote(id, userId)
    }

    @Post(':id/downvote')
    @UseGuards(new AuthGuard())
    downvoteIdea(@Param('id') id: string, @User('id') userId: string) {
        this.logData({ id, userId })
        return this.ideaService.downvote(id, userId)
    }

    @Post(':id/bookmark')
    @UseGuards(new AuthGuard())
    bookmarkIdea(@Param('id') id: string, @User('id') userId: string) {
        this.logData({ id, userId })
        return this.ideaService.bookmark(id, userId)
    }

    @Delete(':id/bookmark')
    @UseGuards(new AuthGuard())
    unbookmarkIdea(@Param('id') id: string, @User('id') userId: string) {
        this.logData({ id, userId })
        return this.ideaService.unbookmark(id, userId)
    }

    private logData(options: any) {
        const logger = new Logger('IdeaController')
        if (options.user) return logger.log('USER' + JSON.stringify(options.user))
        if (options.body) return logger.log('BODY' + JSON.stringify(options.body))
        if (options.id) return logger.log('IDEA' + JSON.stringify(options.id))
    }

}
