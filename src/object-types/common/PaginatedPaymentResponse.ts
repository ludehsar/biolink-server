import { ObjectType } from 'type-graphql'

import { Payment } from '../../entities'
import PagingResult from './PagingResult'

@ObjectType()
export class PaginatedPaymentResponse extends PagingResult(Payment) {}
