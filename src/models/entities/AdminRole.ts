import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { RoleSettings } from '../jsonTypes/RoleSettings'
import { User } from './User'

@Entity()
export class AdminRole extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  roleName!: string

  @Column({ nullable: true })
  roleDescription!: string

  @Column({ type: 'json', nullable: true })
  roleSettings!: RoleSettings[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  // Relationships
  @OneToMany(() => User, (users) => users.adminRole)
  users!: User[]
}
