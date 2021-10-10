import { ObjectType } from 'type-graphql'

import { Link } from '../../entities'
import PagingResult from './PagingResult'

@ObjectType()
export class PaginatedLinkResponse extends PagingResult(Link) {}
