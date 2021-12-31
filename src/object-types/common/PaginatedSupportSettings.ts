import { ObjectType } from 'type-graphql'

import { Support } from '../../entities'
import PagingResult from './PagingResult'

@ObjectType()
export class PaginatedSupportResponse extends PagingResult(Support) {}
