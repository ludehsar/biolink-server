import { Box, Label, Input, Button } from '@admin-bro/design-system'
import styled from 'styled-components'

export const SettingsTabContainer = styled(Box)`
  display: none;
  transition: opacity 0.15s linear;

  &.active {
    display: block;
  }
`

export const FormGroup = styled(Box)`
  margin-bottom: 1rem;
`

export const FormCTAGroup = styled(Box)`
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.primary20};
`

export const FormLabel = styled(Label)``

export const FormInput = styled(Input)``

export const FormSubmitButton = styled(Button)``
