import { ObjectType } from 'type-graphql'

import { Referral } from '../../entities'
import PagingResult from './PagingResult'

@ObjectType()
export class PaginatedReferralResponse extends PagingResult(Referral) {}
