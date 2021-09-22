const allRoles = {
  user: ['biolink.canShow', 'biolink.canShowList'],
  admin: ['getUsers', 'manageUsers'],
}

const roles = Object.keys(allRoles)
const roleRights = new Map(Object.entries(allRoles))

export { roles, roleRights }
