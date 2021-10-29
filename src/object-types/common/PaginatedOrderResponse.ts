import { ObjectType } from 'type-graphql'

import { Order } from '../../entities'
import PagingResult from './PagingResult'

@ObjectType()
export class PaginatedOrderResponse extends PagingResult(Order) {}
