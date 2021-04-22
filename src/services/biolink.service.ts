import { User } from '../models/entities/User'
import { Biolink } from '../models/entities/Biolink'
import { Category } from '../models/entities/Category'
import { BiolinkInput, BiolinkResponse } from '../resolvers/biolink.resolver'
import { validate } from 'class-validator'

export const createNewBiolink = async (
  options: BiolinkInput,
  user: User
): Promise<BiolinkResponse> => {
  try {
    const validationErrors = await validate(options)

    if (validationErrors.length > 0) {
      return {
        errors: validationErrors.map((err) => ({
          field: err.property,
          message: err.constraints?.matches || 'Not correctly formatted',
        })),
      }
    }

    const category = await Category.findOne({ where: { id: options.categoryId } })

    if (!category) {
      return {
        errors: [
          {
            field: 'categoryId',
            message: 'Category not found',
          },
        ],
      }
    }

    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: 'User not authenticated',
          },
        ],
      }
    }

    const biolink = await Biolink.create({
      username: options.username,
      category: category,
      user: user,
    }).save()

    return { biolink }
  } catch (err) {
    console.log(err.constraints)
    switch (err.constraints) {
      case 'UQ_2c53499f3b4932b85f4cf2e44ff': {
        return {
          errors: [
            {
              field: 'username',
              message: 'Duplicate value',
            },
          ],
        }
      }
      default: {
        return {
          errors: [
            {
              field: 'username',
              message: 'Something went wrong',
            },
          ],
        }
      }
    }
  }
}
