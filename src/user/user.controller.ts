import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {

    constructor(private userService: UserService) { }

    @Get('')
    showAllUsers(@Query('page') page: number) {
        return this.userService.showAll(page)
    }

    @Get(':id')
    showUser(id: string) {
        return this.userService.show(id)
    }

}
