import React from 'react'

import { UserDetailsItem, UserDetailsItemLabel, UserDetailsItemValue } from '../styles/user.styled'

export interface UserDetailsProps {
  id?: string
  label: string
  value?: string
}

const UserDetails: React.FC<UserDetailsProps> = (props) => {
  const { id, label, value } = props
  return (
    <UserDetailsItem>
      <UserDetailsItemLabel htmlFor={id && id}>{label}</UserDetailsItemLabel>
      <UserDetailsItemValue id={id && id} readOnly defaultValue={value ? value : 'Unknown'} />
    </UserDetailsItem>
  )
}

export default UserDetails
