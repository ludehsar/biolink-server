import React from 'react'
import moment from 'moment'
import { RecordJSON } from 'admin-bro'
import { UserDetailsContainer, FlexContainer } from '../styles/user.styled'
import UserDetails from './UserDetails'

const UserOverview: React.FC<RecordJSON> = ({ params }) => {
  return (
    <UserDetailsContainer>
      <FlexContainer>
        <UserDetails id="role" label="User Role" value={params.userRole} />
        <UserDetails id="email" label="Email" value={params.email} />
        <UserDetails id="name" label="Name" value={params.name} />
      </FlexContainer>

      <FlexContainer>
        <UserDetails id="ip" label="IP" value={params.lastIPAddress} />
        <UserDetails id="country" label="Country" value={params.country} />
        <UserDetails id="total-logins" label="Total Logins" value={params.totalLogin} />
      </FlexContainer>

      <FlexContainer>
        <UserDetails
          id="last-active"
          label="Last Active"
          value={moment(params.lastActiveTill).toLocaleString()}
        />
        <UserDetails id="last-user-agent" label="Last User Agent" value={params.lastUserAgent} />
        <UserDetails id="plan" label="Current Plan" value={params.plan?.name} />
      </FlexContainer>

      <FlexContainer>
        <UserDetails
          id="plan-expiration-date"
          label="Plan Expiration Date"
          value={params.planExpirationDate}
        />
        <UserDetails
          id="plan-trial-done"
          label="Plan Trial Done"
          value={params.planTrialDone ? 'Yes' : 'No'}
        />
      </FlexContainer>
    </UserDetailsContainer>
  )
}

export default UserOverview
