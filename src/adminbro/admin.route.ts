import AdminBroExpress from '@admin-bro/express'
import AdminBro from 'admin-bro'
import * as argon2 from 'argon2'
import { SessionOptions } from 'express-session'

import { appKey } from '../config/app.config'
import { UserRole } from '../models/enums/UserRole'
import { User } from '../models/entities/User'

const buildAdminRouter = (admin: AdminBro) => {
  const router = AdminBroExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: async (email, password) => {
        const user = await User.findOne({ email })
        if (user) {
          const matched = await argon2.verify(user.encryptedPassword, password)
          if (matched && user.userRole === UserRole.Admin) {
            return user
          }
        }
        return false
      },
      cookiePassword: appKey,
    },
    null,
    {
      resave: false,
      saveUninitialized: true,
    } as SessionOptions
  )

  return router
}

export default buildAdminRouter
