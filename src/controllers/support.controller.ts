import { Service } from 'typedi'

import { MyContext } from '../types'
import { Support } from '../entities'
import { SupportService } from '../services/support.service'
import { NewSupportInput } from '../input-types'

@Service()
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  async addSupport(input: NewSupportInput, context: MyContext): Promise<Support> {
    return await this.supportService.createSupport({
      company: input.company,
      email: input.email,
      fullName: input.fullName,
      message: input.message,
      phoneNumber: input.phoneNumber,
      subject: input.subject,
      user: context.user,
    })
  }
}
