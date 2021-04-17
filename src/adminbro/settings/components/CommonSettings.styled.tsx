import {
  Box,
  H3,
  Label,
  Input,
  Button,
  FormMessage,
  DropZone,
  TextArea,
} from '@admin-bro/design-system'
import styled from 'styled-components'

export const Title = styled(H3)``

export const SettingsTabContainer = styled(Box)`
  display: none;
  transition: opacity 0.15s linear;

  &.active {
    display: block;
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
