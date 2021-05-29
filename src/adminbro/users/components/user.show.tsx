import React from 'react'
import { BasePropertyComponentProps } from 'admin-bro'
import { TableHead, TableRow, TableCell, TableBody, Table, Link } from '@admin-bro/design-system'
import moment from 'moment'

import { FlexContainer, UserDetailsContainer } from './user.show.styled'
import Card from '../../shared/components/DashboardCard'
import UserDetails from './UserDetails'
import { CardGridContainer, Container, Title } from '../../shared/components/Common.styled'
import { UserLogs } from '../../../entities/UserLogs'

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
        <Card
          title="Biolinks"
          icon="Roadmap"
          value={record?.params.biolinkCount}
          href={
            'http://localhost:4000/admin/resources/Biolink?filters.userId=' + record?.id + '&page=1'
          }
        />
        <Card
          title="Links"
          icon="Link"
          value={record?.params.linkCount}
          href={
            'http://localhost:4000/admin/resources/Link?filters.userId=' + record?.id + '&page=1'
          }
        />
        <Card
          title="Custom Domains"
          icon="Wikis"
          value={record?.params.domainCount}
          href={
            'http://localhost:4000/admin/resources/Domain?filters.userId=' + record?.id + '&page=1'
          }
        />
        <Card title="Payments" icon="Filter" value={record?.params.paymentCount} href="#" />
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
              {(record?.params.activities as UserLogs[])?.map((activity, id) => {
                return (
                  <TableRow key={id}>
                    <TableCell>{activity.ipAddress}</TableCell>
                    <TableCell>{activity.deviceType}</TableCell>
                    <TableCell>{activity.osName}</TableCell>
                    <TableCell>{activity.browserName}</TableCell>
                    <TableCell>{activity.browserLanguage}</TableCell>
                    <TableCell>{activity.cityName}</TableCell>
                    <TableCell>
                      {activity.countryCode !== 'Unknown' ? (
                        <>
                          <img
                            src={
                              'https://www.countryflags.io/' + activity.countryCode + '/flat/32.png'
                            }
                            alt="Country flags"
                          />
                        </>
                      ) : (
                        activity.countryCode
                      )}
                    </TableCell>
                    <TableCell>{activity.description}</TableCell>
                    <TableCell>
                      {moment(activity.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <Container display="flex" mt={30} flexGrow={1} justifyContent="flex-end">
            <Link
              href={
                window.location.origin +
                '/admin/resources/UserLogs?page=1&filters.userId=' +
                record?.id
              }
            >
              Show More
            </Link>
          </Container>
        </UserDetailsContainer>
      </Container>
    </>
  )
}

export default Show
