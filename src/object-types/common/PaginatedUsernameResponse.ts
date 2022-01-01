import { ObjectType } from 'type-graphql'

import { Username } from '../../entities'
import PagingResult from './PagingResult'

@ObjectType()
export class PaginatedUsernameResponse extends PagingResult(Username) {}
