import { Field, ObjectType } from 'type-graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { Link } from './Link'
import { User } from './User'

@ObjectType()
@Entity()
export class Project extends BaseEntity {
  @Field(() => String, { nullable: true })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => String, { nullable: true })
  @Column()
  name!: String;

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date;

  // Relationships
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, user => user.projects)
  @JoinColumn()
  user!: User;

  @Field(() => Link, { nullable: true })
  @OneToMany(() => Link, link => link.project)
  links!: Link[];
}
