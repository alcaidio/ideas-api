import { IsNotEmpty, IsString } from 'class-validator';
import { IdeaEntity } from './../idea/idea.entity';

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
    ideas?: IdeaEntity[],
    token?: string
}