import { IsString } from "class-validator";

export class CommentDTO {
    @IsString()
    comment: string
}

export interface CommentRO {
    id?: string,
    comment: string
    updated: Date,
    created: Date
}