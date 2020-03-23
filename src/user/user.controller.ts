import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {

    constructor(private userService: UserService) { }

    @Get('')
    showAllUsers() {
        return this.userService.showAll()
    }

    @Get(':id')
    showUser(id: string) {
        return this.userService.show(id)
    }

}
