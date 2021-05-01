import AdminBroExpress from '@admin-bro/express'
import AdminBro from 'admin-bro'
import * as argon2 from 'argon2'
import { SessionOptions } from 'express-session'
import { Router } from 'express'

import { User } from '../models/entities/User'
import { UserRole } from '../models/enums/UserRole'
import { appKey } from '../config/app.config'

const buildAdminRouter = (admin: AdminBro): Router => {
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
      saveUninitialized: false,
    } as SessionOptions
  )
  // const router = AdminBroExpress.buildRouter(admin)

  return router
}

export default buildAdminRouter
