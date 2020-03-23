import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IdeaEntity } from './../idea/idea.entity';
import { UserRO } from './user.dto';

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn()
    created: Date

    @Column({ type: 'text', unique: true })
    username: string

    @Column('text')
    password: string

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10)
    }

    @OneToMany(type => IdeaEntity, idea => idea.author)
    ideas: IdeaEntity[]

    @ManyToMany(type => IdeaEntity, { cascade: true })
    @JoinTable()
    bookmarks: IdeaEntity[]

    async comparePassword(attempt: string) {
        return await bcrypt.compare(attempt, this.password)
    }

    toResponseObject(showToken: boolean = true): UserRO {
        const { id, created, username, token } = this
        const rO: UserRO = { id, created, username }
        if (showToken) rO.token = token
        if (this.ideas) rO.ideas = this.ideas
        if (this.bookmarks) rO.bookmarks = this.bookmarks
        return rO
    }

    private get token() {
        const { id, username } = this
        return jwt.sign(
            { id, username },
            process.env.SECRET,
            { expiresIn: '7d' }
        )
    }


}