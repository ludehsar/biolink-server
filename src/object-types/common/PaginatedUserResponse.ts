import { ObjectType } from 'type-graphql'

import { User } from '../../entities'
import PagingResult from './PagingResult'

@ObjectType()
export class PaginatedUserResponse extends PagingResult(User) {}
