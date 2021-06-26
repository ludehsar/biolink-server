import { RoleSettings } from '../json-types'
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
import { User } from '../entities'

@ObjectType()
@Entity()
export class AdminRole extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { nullable: true })
  id!: number

  @Column({ unique: true })
  @Field(() => String, { nullable: true })
  roleName!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  roleDescription!: string

  @Column({ type: 'json', nullable: true })
  @Field(() => [RoleSettings], { nullable: true })
  roleSettings!: RoleSettings[]

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
  @OneToMany(() => User, (users) => users.adminRole, { lazy: true })
  users!: Promise<User[]>
}
