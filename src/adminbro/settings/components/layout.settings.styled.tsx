import { Box, H1, Icon, Link } from '@admin-bro/design-system'
import styled from 'styled-components'

export const Container = styled(Box)``

export const Header = styled(H1)``

export const SettingsContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-right: -15px;
  margin-left: -15px;
  margin-bottom: 20px;
`

export const SettingsNavContainer = styled(Box)`
  margin-bottom: 3rem !important;
  flex: 0 0 100%;
  max-width: 100%;

  @media (min-width: 1200px) {
    margin-bottom: 0 !important;
    flex: 0 0 25%;
    max-width: 25%;
  }
`

export const SettingsDetailsContainer = styled(Box)`
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
`

export const SettingsNav = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  padding-left: 0;
  padding-bottom: 0;
  list-style: none;
`

export const SettingsIcon = styled(Icon)`
  & svg {
    fill: ${({ theme }) => theme.colors.filterBg};
  }
`

export const SettingsNavItem = styled(Link)`
  text-decoration: none !important;
  color: ${({ theme }) => theme.colors.filterBg};
  border-radius: 0.25rem;
  display: block;
  padding: 0.5rem 1rem;
  font-size: 14px;

  &.active {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.filterBg};

    ${SettingsIcon} svg {
      fill: ${({ theme }) => theme.colors.white};
    }
  }
`
