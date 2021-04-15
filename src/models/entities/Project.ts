import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

import { Link } from './Link'
import { TrackLink } from './TrackLink'
import { User } from './User'

@ObjectType()
@Entity()
export class Project extends BaseEntity {
  @Field(() => String, { nullable: true })
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field(() => String, { nullable: true })
  @Column()
  projectName!: string

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date

  // Relationships
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'userId' })
  user!: User

  @RelationId((project: Project) => project.user)
  userId!: string

  @Field(() => Link, { nullable: true })
  @OneToMany(() => Link, (link) => link.project)
  links!: Link[]

  @Field(() => TrackLink, { nullable: true })
  @OneToMany(() => TrackLink, (trackLink) => trackLink.user)
  trackLinks!: TrackLink[]
}
