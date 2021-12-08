import React from 'react'
import { BasePropertyComponentProps } from 'admin-bro'
import { TableHead, TableRow, TableCell, TableBody, Table, Link } from '@admin-bro/design-system'
import moment from 'moment'

import { UserDetailsContainer } from '../styles/user.styled'
import { Container, Title } from '../../../shared/components/Common.styled'
import { UserLogs } from '../../../../entities'
import UserOverview from '../components/UserOverview'
import UserCards from '../components/UserCards'

const Show: React.FC<BasePropertyComponentProps> = (props) => {
  const { record } = props

  return (
    <>
      {record && (
        <>
          <UserOverview {...record} />
          <UserCards {...record} />
        </>
      )}
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
