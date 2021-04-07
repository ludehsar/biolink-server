import AdminBroExpress from '@admin-bro/express'
import AdminBro from 'admin-bro'
import * as argon2 from 'argon2'

import { appKey } from '../config/app.config'
import { User } from '../entities/User'

const buildAdminRouter = (admin: AdminBro) => {
  const router = AdminBroExpress.buildAuthenticatedRouter(admin, {
    authenticate: async (email, password) => {
      const user = await User.findOne({ email })
      if (user) {
        const matched = await argon2.verify(user.encryptedPassword, password)
        if (matched) {
          return user
        }
      }
      return false
    },
    cookiePassword: appKey
  })

  return router
}

export default buildAdminRouter
