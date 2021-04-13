import React from 'react'
import { BasePropertyComponentProps } from 'admin-bro'

import { FlexContainer, GridContainer, UserDetailsContainer } from './user.show.styled'
import Card from '../../shared/components/DashboardCard'
import UserDetails from './UserDetails'

const Show: React.FC<BasePropertyComponentProps> = (props) => {
  const { record } = props

  return (
    <>
      <UserDetailsContainer>
        <FlexContainer>
          <UserDetails id="role" label="User Role" value={record?.params.userRole} />
          <UserDetails id="email" label="Email" value={record?.params.email} />
          <UserDetails id="name" label="Name" value={record?.params.name} />
        </FlexContainer>

        <FlexContainer>
          <UserDetails id="status" label="Account Status" value={record?.params.activeStatus} />
          <UserDetails id="ip" label="IP" value={record?.params.lastIPAddress} />
          <UserDetails id="country" label="Country" value={record?.params.country} />
        </FlexContainer>

        <FlexContainer>
          <UserDetails id="last-active" label="Last Active" value="Not implemented" />
          <UserDetails
            id="last-user-agent"
            label="Last User Agent"
            value={record?.params.lastUserAgent}
          />
          <UserDetails id="plan" label="Current Plan" value={record?.params.plan?.name} />
        </FlexContainer>

        <FlexContainer>
          <UserDetails
            id="plan-expiration-date"
            label="Plan Expiration Date"
            value={record?.params.planExpirationDate}
          />
          <UserDetails
            id="plan-trial-done"
            label="Plan Trial Done"
            value={record?.params.planTrialDone ? 'Yes' : 'No'}
          />
          <UserDetails id="total-logins" label="Total Logins" value={record?.params.totalLogin} />
        </FlexContainer>
      </UserDetailsContainer>
      <GridContainer>
        <Card title="Projects" icon="Roadmap" value={0} href="Something" />
        <Card title="Links" icon="Link" value={0} href="Something" />
        <Card title="Custom Domains" icon="Wikis" value={0} href="Something" />
        <Card title="Payments" icon="Filter" value={0} href="Something" />
      </GridContainer>
    </>
  )
}

export default Show
