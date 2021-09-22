const allRoles = {
  user: ['biolink.canShow', 'biolink.canShowList', 'biolink'],
}

const roles = Object.keys(allRoles)
const roleRights = new Map(Object.entries(allRoles))

export default { roles, roleRights }
