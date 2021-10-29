import { ObjectType } from 'type-graphql'

import { Service } from '../../entities'
import PagingResult from './PagingResult'

@ObjectType()
export class PaginatedServiceResponse extends PagingResult(Service) {}
