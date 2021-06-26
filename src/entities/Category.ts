import { Field, Int, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Biolink, Verification } from '../entities'

@ObjectType()
@Entity()
export class Category extends BaseEntity {
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String, { nullable: true })
  @Column({ unique: true })
  categoryName!: string

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @Column({ type: 'boolean', nullable: true, default: false })
  featured!: boolean

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  @Field(() => String, { nullable: true })
  deletedAt?: Date

  // Relationships
  @OneToMany(() => Biolink, (biolink) => biolink.category, { lazy: true })
  biolinks!: Promise<Biolink[]>

  @OneToMany(() => Verification, (verification) => verification.category, { lazy: true })
  verifications!: Promise<Verification[]>
}
