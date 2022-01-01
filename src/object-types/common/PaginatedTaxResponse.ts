import { ObjectType } from 'type-graphql'

import { Tax } from '../../entities'
import PagingResult from './PagingResult'

@ObjectType()
export class PaginatedTaxResponse extends PagingResult(Tax) {}
