import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { CodeType } from '../enums/CodeType'

@Entity()
export class Code extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'enum', enum: CodeType, default: CodeType.Discount })
  type!: CodeType

  @Column({ unique: true })
  code!: string

  @Column({ nullable: true, default: 0 })
  discount!: number

  @Column({ nullable: true, default: 0 })
  quantity!: number

  @Column({ type: 'date', nullable: true })
  expireDate!: Date

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
