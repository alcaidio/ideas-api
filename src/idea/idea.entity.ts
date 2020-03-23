import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CommentEntity } from './../comment/comment.entity';

@Entity('idea')
export class IdeaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn()
    created: Date

    @UpdateDateColumn()
    updated: Date

    @Column('text')
    idea: string

    @Column('text')
    description: string

    @ManyToOne(type => UserEntity, author => author.ideas)
    author: UserEntity

    @ManyToMany(type => UserEntity, { cascade: true })
    @JoinTable()
    upvotes: UserEntity[]

    @ManyToMany(type => UserEntity, { cascade: true })
    @JoinTable()
    downvotes: UserEntity[]

    // Cascade because if an idea are deleted, all associated comments are deleted too
    @OneToMany(type => CommentEntity, comment => comment.idea, { cascade: true })
    comments: CommentEntity[]

}