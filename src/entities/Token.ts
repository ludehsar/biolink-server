import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm'

import { User } from '../entities'
import { TokenType } from '../enums'

@ObjectType()
@Entity()
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @Field(() => String, { nullable: true })
  id!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  token!: string

  @Field(() => String, { nullable: true })
  @Column({
    type: 'enum',
    enum: TokenType,
    default: TokenType.Refresh,
    nullable: true,
  })
  type?: TokenType

  @Field(() => String, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  expires?: Date

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', default: false })
  blacklisted?: boolean

  // Relationships
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.biolinks, { lazy: true, cascade: true })
  @JoinColumn({ name: 'userId' })
  user!: Promise<User>

  @RelationId((token: Token) => token.user)
  userId!: string
}
