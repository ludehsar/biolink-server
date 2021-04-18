import React, { useEffect, useCallback, useState } from 'react'

import {
  Container,
  Header,
  SettingsContainer,
  SettingsDetailsContainer,
  SettingsIcon,
  SettingsNav,
  SettingsNavContainer,
  SettingsNavItem,
} from './layout.settings.styled'
import { CardBox, CardBody } from '../../shared/components/Common.styled'
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
      <SettingsContainer>
        <SettingsNavContainer>
          <SettingsNav>
            <SettingsNavItem
              className={activeMenus === 'main' ? 'active' : ''}
              onClick={() => setActiveMenus('main')}
              href="#main"
            >
              <SettingsIcon icon="Home" />
              Main
            </SettingsNavItem>
            <SettingsNavItem
              className={activeMenus === 'links' ? 'active' : ''}
              onClick={() => setActiveMenus('links')}
              href="#links"
            >
              <SettingsIcon icon="Link" />
              Links
            </SettingsNavItem>
            <SettingsNavItem
              className={activeMenus === 'payments' ? 'active' : ''}
              onClick={() => setActiveMenus('payments')}
              href="#payments"
            >
              <SettingsIcon icon="Money" />
              Payments
            </SettingsNavItem>
            <SettingsNavItem
              className={activeMenus === 'business' ? 'active' : ''}
              onClick={() => setActiveMenus('business')}
              href="#business"
            >
              <SettingsIcon icon="Finance" />
              Business
            </SettingsNavItem>
            <SettingsNavItem
              className={activeMenus === 'captcha' ? 'active' : ''}
              onClick={() => setActiveMenus('captcha')}
              href="#captcha"
            >
              <SettingsIcon icon="Bot" />
              Captcha
            </SettingsNavItem>
            <SettingsNavItem
              className={activeMenus === 'facebook-login' ? 'active' : ''}
              onClick={() => setActiveMenus('facebook-login')}
              href="#facebook-login"
            >
              <SettingsIcon icon="LogoFacebook" />
              Facebook Login
            </SettingsNavItem>
            <SettingsNavItem
              className={activeMenus === 'ads' ? 'active' : ''}
              onClick={() => setActiveMenus('ads')}
              href="#ads"
            >
              <SettingsIcon icon="TagGroup" />
              Ads
            </SettingsNavItem>
            <SettingsNavItem
              className={activeMenus === 'socials' ? 'active' : ''}
              onClick={() => setActiveMenus('socials')}
              href="#socials"
            >
              <SettingsIcon icon="LogoInstagram" />
              Socials
            </SettingsNavItem>
            <SettingsNavItem
              className={activeMenus === 'email' ? 'active' : ''}
              onClick={() => setActiveMenus('email')}
              href="#email"
            >
              <SettingsIcon icon="SendAlt" />
              Email
            </SettingsNavItem>
            <SettingsNavItem
              className={activeMenus === 'notifications' ? 'active' : ''}
              onClick={() => setActiveMenus('notifications')}
              href="#notifications"
            >
              <SettingsIcon icon="Notification" />
              Email Notification
            </SettingsNavItem>
          </SettingsNav>
        </SettingsNavContainer>
        <SettingsDetailsContainer>
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
        </SettingsDetailsContainer>
      </SettingsContainer>
    </Container>
  )
}

export default SettingsLayout
