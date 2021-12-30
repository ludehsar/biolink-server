import { ObjectType } from 'type-graphql'

import { BlackList } from '../../entities'
import PagingResult from './PagingResult'

@ObjectType()
export class PaginatedBlackListResponse extends PagingResult(BlackList) {}
