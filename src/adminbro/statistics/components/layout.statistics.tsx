import React, { useState, useEffect } from 'react'

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
import GrowthStatistics from './growth.statistics'

const StatisticsLayout: React.FC = () => {
  const [activeMenus, setActiveMenus] = useState('growth')
  // const [settingsData, setSettingsData] = useState<SettingsProps>({})

  // const getSettingsData = useCallback(async () => {
  //   const fetchedSettingsData = await getAllSettingsData()
  //   setSettingsData(fetchedSettingsData)
  // }, [])

  useEffect(() => {
    const urlHash = window.location.hash.substr(1)

    if (urlHash) {
      setActiveMenus(urlHash)
    }

    // getSettingsData()
  }, [])

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
              <GrowthStatistics className={activeMenus === 'growth' ? 'active' : ''} />
            </CardBody>
          </CardBox>
        </MainDetailsContainer>
      </MainContainer>
    </Container>
  )
}

export default StatisticsLayout
