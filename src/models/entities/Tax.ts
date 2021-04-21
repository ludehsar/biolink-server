import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { TaxValueType } from '../enums/TaxValueType'
import { TaxBillingForType } from '../enums/TaxBillingForType'
import { TaxType } from '../enums/TaxType'

@Entity()
export class Tax extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  internalName!: string

  @Column()
  name!: string

  @Column()
  description!: string

  @Column({ default: 20 })
  value!: number

  @Column({ type: 'enum', enum: TaxValueType, default: TaxValueType.Fixed })
  valueType!: TaxValueType

  @Column({ type: 'enum', enum: TaxType, default: TaxType.Inclusive })
  type!: TaxType

  @Column({ type: 'enum', enum: TaxBillingForType, default: TaxBillingForType.Both })
  billingFor!: TaxBillingForType

  @Column({ nullable: true })
  countries!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
