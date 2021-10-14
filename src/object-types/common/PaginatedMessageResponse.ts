import { ObjectType } from 'type-graphql'

import { Message } from '../../entities'
import PagingResult from './PagingResult'

@ObjectType()
export class PaginatedMessageResponse extends PagingResult(Message) {}
