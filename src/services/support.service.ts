import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { Support } from '../entities'
import { ResolveStatus } from '../enums'
import { SupportUpdateBody } from '../interfaces/SupportUpdateBody'

@Service()
export class SupportService {
  constructor(@InjectRepository(Support) private readonly supportRepository: Repository<Support>) {}

  /**
   * Creates a new support
   * @param {SupportUpdateBody} updateBody
   * @returns {Promise<boolean>}
   */
  async createSupport(updateBody: SupportUpdateBody): Promise<Support> {
    const support = this.supportRepository.create({
      company: updateBody.company,
      email: updateBody.email,
      fullName: updateBody.fullName,
      message: updateBody.message,
      phoneNumber: updateBody.phoneNumber,
      status: ResolveStatus.Pending,
      subject: updateBody.subject,
    })

    if (updateBody.user) support.user = Promise.resolve(updateBody.user)

    await support.save()

    return support
  }
}
