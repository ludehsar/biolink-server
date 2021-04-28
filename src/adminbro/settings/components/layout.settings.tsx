import React, { useEffect, useCallback, useState } from 'react'

import {
  CardBox,
  CardBody,
  Container,
  Header,
  MainContainer,
  MainDetailsContainer,
  MainIcon,
  MainNav,
  MainNavContainer,
  MainNavItem,
} from '../../shared/components/Common.styled'
import MainSettings from './main.settings'
import LinkSettings from './links.settings'
import PaymentSettings from './payments.settings'
import BusinessSettings from './business.settings'
import CaptchaSettings from './captcha.settings'
import FacebookSettings from './facebook.settings'
import AdsSettings from './ads.settings'
import SocialSettings from './socials.settings'
import EmailSettings from './email.settings'
import NotificationSettings from './notification.settings'
import { getAllSettingsData, SettingsProps } from '../actions/globalSettingsAction'

const SettingsLayout: React.FC = () => {
  const [activeMenus, setActiveMenus] = useState('main')
  const [settingsData, setSettingsData] = useState<SettingsProps>({})

  const getSettingsData = useCallback(async () => {
    const fetchedSettingsData = await getAllSettingsData()
    setSettingsData(fetchedSettingsData)
  }, [])

  useEffect(() => {
    const urlHash = window.location.hash.substr(1)

    if (urlHash) {
      setActiveMenus(urlHash)
    }

    getSettingsData()
  }, [getSettingsData])

  return (
    <Container>
      <Header>Settings</Header>
      <MainContainer>
        <MainNavContainer>
          <MainNav>
            <MainNavItem
              className={activeMenus === 'main' ? 'active' : ''}
              onClick={() => setActiveMenus('main')}
              href="#main"
            >
              <MainIcon icon="Home" />
              Main
            </MainNavItem>
            <MainNavItem
              className={activeMenus === 'links' ? 'active' : ''}
              onClick={() => setActiveMenus('links')}
              href="#links"
            >
              <MainIcon icon="Link" />
              Links
            </MainNavItem>
            <MainNavItem
              className={activeMenus === 'payments' ? 'active' : ''}
              onClick={() => setActiveMenus('payments')}
              href="#payments"
            >
              <MainIcon icon="Money" />
              Payments
            </MainNavItem>
            <MainNavItem
              className={activeMenus === 'business' ? 'active' : ''}
              onClick={() => setActiveMenus('business')}
              href="#business"
            >
              <MainIcon icon="Finance" />
              Business
            </MainNavItem>
            <MainNavItem
              className={activeMenus === 'captcha' ? 'active' : ''}
              onClick={() => setActiveMenus('captcha')}
              href="#captcha"
            >
              <MainIcon icon="Bot" />
              Captcha
            </MainNavItem>
            <MainNavItem
              className={activeMenus === 'facebook-login' ? 'active' : ''}
              onClick={() => setActiveMenus('facebook-login')}
              href="#facebook-login"
            >
              <MainIcon icon="LogoFacebook" />
              Facebook Login
            </MainNavItem>
            <MainNavItem
              className={activeMenus === 'ads' ? 'active' : ''}
              onClick={() => setActiveMenus('ads')}
              href="#ads"
            >
              <MainIcon icon="TagGroup" />
              Ads
            </MainNavItem>
            <MainNavItem
              className={activeMenus === 'socials' ? 'active' : ''}
              onClick={() => setActiveMenus('socials')}
              href="#socials"
            >
              <MainIcon icon="LogoInstagram" />
              Socials
            </MainNavItem>
            <MainNavItem
              className={activeMenus === 'email' ? 'active' : ''}
              onClick={() => setActiveMenus('email')}
              href="#email"
            >
              <MainIcon icon="SendAlt" />
              Email
            </MainNavItem>
            <MainNavItem
              className={activeMenus === 'notifications' ? 'active' : ''}
              onClick={() => setActiveMenus('notifications')}
              href="#notifications"
            >
              <MainIcon icon="Notification" />
              Email Notification
            </MainNavItem>
          </MainNav>
        </MainNavContainer>
        <MainDetailsContainer>
          <CardBox>
            <CardBody>
              <MainSettings
                value={settingsData.main}
                className={activeMenus === 'main' ? 'active' : ''}
              />
              <LinkSettings
                value={settingsData.links}
                className={activeMenus === 'links' ? 'active' : ''}
              />
              <PaymentSettings
                value={settingsData.payments}
                className={activeMenus === 'payments' ? 'active' : ''}
              />
              <BusinessSettings
                value={settingsData.business}
                className={activeMenus === 'business' ? 'active' : ''}
              />
              <CaptchaSettings
                value={settingsData.captcha}
                className={activeMenus === 'captcha' ? 'active' : ''}
              />
              <FacebookSettings
                value={settingsData.facebook_login}
                className={activeMenus === 'facebook-login' ? 'active' : ''}
              />
              <AdsSettings
                value={settingsData.ads}
                className={activeMenus === 'ads' ? 'active' : ''}
              />
              <SocialSettings
                value={settingsData.socials}
                className={activeMenus === 'socials' ? 'active' : ''}
              />
              <EmailSettings
                value={settingsData.email}
                className={activeMenus === 'email' ? 'active' : ''}
              />
              <NotificationSettings
                value={settingsData.email_notification}
                className={activeMenus === 'notifications' ? 'active' : ''}
              />
            </CardBody>
          </CardBox>
        </MainDetailsContainer>
      </MainContainer>
    </Container>
  )
}

export default SettingsLayout
