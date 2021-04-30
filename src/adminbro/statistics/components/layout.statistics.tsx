import moment from 'moment'
import React, { useState, useCallback, useEffect } from 'react'

import { StatisticsForAdminsProps } from '../../../services/analytics.service'

import {
  Container,
  Header,
  MainContainer,
  MainNavContainer,
  MainNav,
  MainNavItem,
  MainIcon,
  MainDetailsContainer,
  CardBox,
  CardBody,
} from '../../shared/components/Common.styled'
import { getStatisticsData } from '../actions/fetchAllData'
import GrowthStatistics from './growth.statistics'

const StatisticsLayout: React.FC = () => {
  const [activeMenus, setActiveMenus] = useState('growth')
  const [data, setData] = useState<StatisticsForAdminsProps>()

  const [userRegistrationStartDate, setUserRegistrationStartDate] = useState<Date>(
    moment().subtract(30, 'd').toDate()
  )
  const [userRegistrationEndDate, setUserRegistrationEndDate] = useState<Date>(moment().toDate())

  const [biolinkCreationStartDate, setBiolinkCreationStartDate] = useState<Date>(
    moment().subtract(30, 'd').toDate()
  )
  const [biolinkCreationEndDate, setBiolinkCreationEndDate] = useState<Date>(moment().toDate())

  const [linkCreationStartDate, setLinkCreationStartDate] = useState<Date>(
    moment().subtract(30, 'd').toDate()
  )
  const [linkCreationEndDate, setLinkCreationEndDate] = useState<Date>(moment().toDate())

  const getData = useCallback(async () => {
    const fetchedData = await getStatisticsData(
      userRegistrationStartDate,
      userRegistrationEndDate,
      biolinkCreationStartDate,
      biolinkCreationEndDate,
      linkCreationStartDate,
      linkCreationEndDate
    )

    setData(fetchedData.data)
  }, [
    userRegistrationStartDate,
    userRegistrationEndDate,
    biolinkCreationStartDate,
    biolinkCreationEndDate,
    linkCreationStartDate,
    linkCreationEndDate,
  ])

  useEffect(() => {
    const urlHash = window.location.hash.substr(1)

    if (urlHash) {
      setActiveMenus(urlHash)
    }

    getData()
  }, [getData])

  return (
    <Container m={24}>
      <Header>Statistics</Header>
      <MainContainer>
        <MainNavContainer>
          <MainNav>
            <MainNavItem
              className={activeMenus === 'growth' ? 'active' : ''}
              onClick={() => setActiveMenus('growth')}
              href="#growth"
            >
              <MainIcon icon="Sprout" />
              Growth
            </MainNavItem>
          </MainNav>
          <MainNav>
            <MainNavItem
              className={activeMenus === 'payments' ? 'active' : ''}
              onClick={() => setActiveMenus('payments')}
              href="#payments"
            >
              <MainIcon icon="Money" />
              Payments
            </MainNavItem>
          </MainNav>
          <MainNav>
            <MainNavItem
              className={activeMenus === 'links' ? 'active' : ''}
              onClick={() => setActiveMenus('links')}
              href="#links"
            >
              <MainIcon icon="Link" />
              Links
            </MainNavItem>
          </MainNav>
        </MainNavContainer>
        <MainDetailsContainer>
          <CardBox>
            <CardBody>
              <GrowthStatistics
                chartData={data}
                className={activeMenus === 'growth' ? 'active' : ''}
                {...{
                  userRegistrationStartDate,
                  setUserRegistrationStartDate,
                  userRegistrationEndDate,
                  setUserRegistrationEndDate,
                  biolinkCreationStartDate,
                  setBiolinkCreationStartDate,
                  biolinkCreationEndDate,
                  setBiolinkCreationEndDate,
                  linkCreationStartDate,
                  setLinkCreationStartDate,
                  linkCreationEndDate,
                  setLinkCreationEndDate,
                }}
              />
            </CardBody>
          </CardBox>
        </MainDetailsContainer>
      </MainContainer>
    </Container>
  )
}

export default StatisticsLayout
