import {
  Box,
  Button,
  DropZone,
  FormMessage,
  H1,
  H3,
  Icon,
  Input,
  Label,
  Link,
  TextArea,
} from '@admin-bro/design-system'
import styled from 'styled-components'

export const Container = styled(Box)``

export const Header = styled(H1)``

export const Title = styled(H3)``

export const MainContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
  margin-bottom: 20px;
`

export const MainNavContainer = styled(Box)`
  margin-bottom: 3rem !important;
  flex: 0 0 100%;
  max-width: 100%;
  padding-left: 15px;
  padding-right: 15px;

  @media (min-width: 1200px) {
    margin-bottom: 0 !important;
    flex: 0 0 25%;
    max-width: 25%;
  }
`

export const MainDetailsContainer = styled(Box)`
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
  padding-left: 15px;
  padding-right: 15px;
`

export const MainNav = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  padding-left: 0;
  padding-bottom: 0;
  list-style: none;
`

export const MainIcon = styled(Icon)`
  & svg {
    fill: ${({ theme }) => theme.colors.filterBg};
  }
`

export const MainNavItem = styled(Link)`
  text-decoration: none !important;
  color: ${({ theme }) => theme.colors.filterBg};
  border-radius: 0.25rem;
  display: block;
  padding: 0.5rem 1rem;
  font-size: 14px;

  &.active {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.filterBg};

    ${MainIcon} svg {
      fill: ${({ theme }) => theme.colors.white};
    }
  }
`

export const MainTabContainer = styled(Box)`
  display: none;
  transition: opacity 0.15s linear;

  &.active {
    display: block;
  }
`

export const CardBox = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: row;
  min-width: 0;
  word-wrap: break-word;
  height: 100% !important;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.white};
  background-clip: border-box;
  border: 1px solid ${({ theme }) => theme.colors.grey20};
  border-radius: 0.25em;
`

export const CardBody = styled(Box)`
  flex: 1 1 auto;
  min-height: 1px;
  padding: 1.25em;
`

export const CardFooter = styled(Box)`
  padding: 0.75rem 1.25rem;
  background-color: rgba(0, 0, 0, 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.125);

  &:last-child {
    border-radius: 0 0 calc(0.25rem - 1px) calc(0.25rem - 1px);
  }
`

export const FormHelper = styled(FormMessage)`
  color: ${({ theme }) => theme.colors.grey60};
`

export const FormTextArea = styled(TextArea)`
  width: 100%;
`

export const FileUploader = styled(DropZone)``

export const FormCTAGroup = styled(Box)`
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.primary20};
`

export const FormLabel = styled(Label)``

export const FormInput = styled(Input)``

export const FormSubmitButton = styled(Button)``
