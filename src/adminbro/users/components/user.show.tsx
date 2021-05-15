import React from 'react'
import { BasePropertyComponentProps } from 'admin-bro'
import { TableHead, TableRow, TableCell, TableBody, Table } from '@admin-bro/design-system'
import moment from 'moment'

import { FlexContainer, UserDetailsContainer } from './user.show.styled'
import Card from '../../shared/components/DashboardCard'
import UserDetails from './UserDetails'
import { CardGridContainer, Container, Title } from '../../shared/components/Common.styled'
import { UserLogs } from '../../../models/entities/UserLogs'

const Show: React.FC<BasePropertyComponentProps> = (props) => {
  console.log(props)
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
          <UserDetails id="status" label="Account Status" value={record?.params.accountStatus} />
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
      <CardGridContainer>
        <Card title="Projects" icon="Roadmap" value={0} href="Something" />
        <Card title="Links" icon="Link" value={0} href="Something" />
        <Card title="Custom Domains" icon="Wikis" value={0} href="Something" />
        <Card title="Payments" icon="Filter" value={0} href="Something" />
      </CardGridContainer>
      <Container>
        <UserDetailsContainer>
          <Title>User Activities</Title>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>IP Address</TableCell>
                <TableCell>Device Type</TableCell>
                <TableCell>Operating System</TableCell>
                <TableCell>Browser Name</TableCell>
                <TableCell>Browser Language</TableCell>
                <TableCell>City Name</TableCell>
                <TableCell>Country Code</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(record?.params.activities as UserLogs[])?.map((activity, id) => (
                <TableRow key={id}>
                  <TableCell>{activity.ipAddress}</TableCell>
                  <TableCell>{activity.deviceType}</TableCell>
                  <TableCell>{activity.osName}</TableCell>
                  <TableCell>{activity.browserName}</TableCell>
                  <TableCell>{activity.browserLanguage}</TableCell>
                  <TableCell>{activity.cityName}</TableCell>
                  <TableCell>{activity.countryCode}</TableCell>
                  <TableCell>{activity.description}</TableCell>
                  <TableCell>{moment(activity.createdAt).format('DD-MM-YYYY HH:mm:ss')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </UserDetailsContainer>
      </Container>
    </>
  )
}

export default Show
