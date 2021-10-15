import { ObjectType } from 'type-graphql'

import { Plan } from '../../entities'
import PagingResult from './PagingResult'

@ObjectType()
export class PaginatedPlanResponse extends PagingResult(Plan) {}
