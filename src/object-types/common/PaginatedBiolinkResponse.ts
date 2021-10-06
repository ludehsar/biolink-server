import { ObjectType } from 'type-graphql'

import { Biolink } from '../../entities'
import PagingResult from './PagingResult'

@ObjectType()
export class PaginatedBiolinkResponse extends PagingResult(Biolink) {}
