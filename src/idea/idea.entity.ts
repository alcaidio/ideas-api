import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
}