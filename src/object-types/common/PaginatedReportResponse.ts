import { ObjectType } from 'type-graphql'

import { Report } from '../../entities'
import PagingResult from './PagingResult'

@ObjectType()
export class PaginatedReportResponse extends PagingResult(Report) {}
