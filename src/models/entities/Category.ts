import { Field, Int, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Biolink } from './Biolink'
import { Verification } from './Verification'

@ObjectType()
@Entity()
export class Category extends BaseEntity {
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String, { nullable: true })
  @Column({ unique: true })
  categoryName!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  // Relationships
  @Field(() => [Biolink], { nullable: true })
  @OneToMany(() => Biolink, (biolink) => biolink.category)
  biolinks!: Biolink[]

  @OneToMany(() => Verification, (verification) => verification.category)
  verifications!: Verification[]
}
