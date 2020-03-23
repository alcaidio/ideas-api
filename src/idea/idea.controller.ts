import { Body, Controller, Delete, Get, Logger, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';
import { ValidationPipe } from '../shared/validation.pipe';
import { IdeaDTO } from './idea.dto';
import { IdeaService } from './idea.service';

@Controller('api/ideas')
export class IdeaController {

    constructor(private ideaService: IdeaService) { }

    @Get()
    showAllIdeas() {
        return this.ideaService.showAll()
    }

    @Post()
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
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
    @UsePipes(new ValidationPipe())
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
