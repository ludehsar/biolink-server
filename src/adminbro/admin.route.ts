import AdminBroExpress from '@admin-bro/express'
import AdminBro, { CurrentAdmin } from 'admin-bro'
import * as argon2 from 'argon2'
import { SessionOptions } from 'express-session'
import { Router } from 'express'

import { User } from '../models/entities/User'
import { appKey } from '../config/app.config'
import { AdminRole } from '../models/entities/AdminRole'

const buildAdminRouter = (admin: AdminBro): Router => {
  const router = AdminBroExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: async (email, password): Promise<CurrentAdmin | boolean> => {
        const user = await User.findOne({ email })
        if (user) {
          const matched = await argon2.verify(user.encryptedPassword, password)
          if (matched && user.adminRoleId != null) {
            const role = await AdminRole.findOne(user.adminRoleId)

            if (!role) return false

            return {
              id: user.id,
              email: user.email,
              title: user.name,
              avatarUrl: `https://ui-avatars.com/api/?name=${user.name}`,
              role,
            }
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
