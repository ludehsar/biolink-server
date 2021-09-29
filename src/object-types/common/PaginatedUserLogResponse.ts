import { ObjectType } from 'type-graphql'

import { UserLogs } from '../../entities'
import PagingResult from './PagingResult'

@ObjectType()
export class PaginatedUserLogResponse extends PagingResult(UserLogs) {}
