import { ObjectType } from 'type-graphql'

import { Category } from '../../entities'
import PagingResult from './PagingResult'

@ObjectType()
export class PaginatedCategoryResponse extends PagingResult(Category) {}
