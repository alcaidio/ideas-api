import { IsNotEmpty, IsString } from 'class-validator'

export class UserDTO {
    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    password: string
}

export interface UserRO {
    id: string,
    username: string,
    created: Date,
    token?: string
}