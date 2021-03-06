import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

import { User } from '.'
import { PremiumUsernameType } from '../enums'
import { Biolink } from './Biolink'

@ObjectType()
@Entity()
export class Username extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @Field(() => String, { nullable: true })
  id!: string

  @Column({ unique: true, nullable: true })
  @Field(() => String, { nullable: true })
  username!: string

  @Column({ type: 'enum', enum: PremiumUsernameType, default: PremiumUsernameType.None })
  @Field(() => String, { nullable: true })
  premiumType!: PremiumUsernameType

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  expireDate!: Date | null

  @CreateDateColumn()
  @Field(() => String, { nullable: true })
  createdAt!: Date

  @UpdateDateColumn()
  @Field(() => String, { nullable: true })
  updatedAt!: Date

  @DeleteDateColumn()
  @Field(() => String, { nullable: true })
  deletedAt?: Date

  // Relationships
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.usernames, { nullable: true, lazy: true })
  @JoinColumn({ name: 'ownerId' })
  owner!: Promise<User> | User | null

  @RelationId((username: Username) => username.owner)
  ownerId!: string

  @Field(() => Biolink, { nullable: true })
  @OneToOne(() => Biolink, (biolink) => biolink.username, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'biolinkId' })
  biolink?: Promise<Biolink> | Biolink | null

  @RelationId((username: Username) => username.biolink)
  biolinkId!: string
}
