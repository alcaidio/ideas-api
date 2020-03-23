import { UserEntity } from 'src/user/user.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IdeaEntity } from './../idea/idea.entity';

@Entity('comment')
export class CommentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn()
    created: Date

    @UpdateDateColumn()
    updated: Date

    @Column('text')
    comment: string

    @ManyToOne(type => UserEntity)
    @JoinTable()
    author: UserEntity

    @ManyToOne(type => IdeaEntity, idea => idea.comments)
    idea: IdeaEntity
}