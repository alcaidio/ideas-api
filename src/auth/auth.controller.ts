import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CustomValidationPipe } from 'src/shared/custom-validation.pipe';
import { UserDTO } from 'src/user/user.dto';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('login')
    @UsePipes(new CustomValidationPipe())
    login(@Body() data: UserDTO) {
        return this.authService.login(data)
    }

    @Post('register')
    @UsePipes(new CustomValidationPipe())
    register(@Body() data: UserDTO) {
        return this.authService.register(data)
    }

}
