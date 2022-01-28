import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { ConnectionArgs, NewCodeInput } from '../../input-types'
import { Code } from '../../entities'
import { CodeController } from '../../controllers'
import { PaginatedCodeResponse } from '../../object-types/common/PaginatedCodeResponse'
import { authAdmin } from '../../middlewares/authAdmin'

@Resolver()
export class CodeAdminResolver {
  constructor(private readonly codeController: CodeController) {}

  @Query(() => PaginatedCodeResponse, { nullable: true })
  @UseMiddleware(authAdmin('code.canShowList'))
  async getAllDiscounts(@Arg('options') options: ConnectionArgs): Promise<PaginatedCodeResponse> {
    return await this.codeController.getAllDiscountCodes(options)
  }

  @Query(() => PaginatedCodeResponse, { nullable: true })
  @UseMiddleware(authAdmin('code.canShowList'))
  async getAllReferrals(@Arg('options') options: ConnectionArgs): Promise<PaginatedCodeResponse> {
    return await this.codeController.getAllReferralCodes(options)
  }

  @Query(() => PaginatedCodeResponse, { nullable: true })
  @UseMiddleware(authAdmin('code.canShowList'))
  async getAllCodes(@Arg('options') options: ConnectionArgs): Promise<PaginatedCodeResponse> {
    return await this.codeController.getAllCodes(options)
  }

  @Query(() => Code, { nullable: true })
  @UseMiddleware(authAdmin('code.canShow'))
  async getCode(@Arg('codeId', () => String) codeId: string): Promise<Code> {
    return await this.codeController.getCode(codeId)
  }

  @Mutation(() => Code, { nullable: true })
  @UseMiddleware(authAdmin('code.canCreate'))
  async addCode(@Arg('options') options: NewCodeInput): Promise<Code> {
    return await this.codeController.createCode(options)
  }

  @Mutation(() => Code, { nullable: true })
  @UseMiddleware(authAdmin('code.canEdit'))
  async editCode(
    @Arg('codeId', () => String) codeId: string,
    @Arg('options') options: NewCodeInput
  ): Promise<Code> {
    return await this.codeController.updateCode(codeId, options)
  }

  @Mutation(() => Code, { nullable: true })
  @UseMiddleware(authAdmin('code.canDelete'))
  async deleteCode(@Arg('codeId', () => String) codeId: string): Promise<Code> {
    return await this.codeController.deleteCode(codeId)
  }
}
