import { BasePropertyComponentProps } from 'admin-bro'
import React, { useEffect, useState } from 'react'

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

const SettingsLayout: React.FC<BasePropertyComponentProps> = () => {
  const [activeMenus, setActiveMenus] = useState('main')

  useEffect(() => {
    const urlHash = window.location.hash.substr(1)

    if (urlHash) {
      setActiveMenus(urlHash)
    }
  }, [])

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
              <MainSettings className={activeMenus === 'main' ? 'active' : ''} />
              <LinkSettings className={activeMenus === 'links' ? 'active' : ''} />
              <PaymentSettings className={activeMenus === 'payments' ? 'active' : ''} />
              <BusinessSettings className={activeMenus === 'business' ? 'active' : ''} />
              <CaptchaSettings className={activeMenus === 'captcha' ? 'active' : ''} />
              <FacebookSettings className={activeMenus === 'facebook-login' ? 'active' : ''} />
              <AdsSettings className={activeMenus === 'ads' ? 'active' : ''} />
              <SocialSettings className={activeMenus === 'socials' ? 'active' : ''} />
              <EmailSettings className={activeMenus === 'email' ? 'active' : ''} />
              <NotificationSettings className={activeMenus === 'notifications' ? 'active' : ''} />
            </CardBody>
          </CardBox>
        </SettingsDetailsContainer>
      </SettingsContainer>
    </Container>
  )
}

export default SettingsLayout
