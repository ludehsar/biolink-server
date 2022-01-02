import { ObjectType } from 'type-graphql'

import { Verification } from '../../entities'
import PagingResult from './PagingResult'

@ObjectType()
export class PaginatedVerificationResponse extends PagingResult(Verification) {}
