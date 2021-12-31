import { ObjectType } from 'type-graphql'

import { Code } from '../../entities'
import PagingResult from './PagingResult'

@ObjectType()
export class PaginatedCodeResponse extends PagingResult(Code) {}
