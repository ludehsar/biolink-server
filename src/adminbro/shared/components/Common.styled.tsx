import {
  Box,
  Button,
  DropZone,
  FormMessage,
  H3,
  Input,
  Label,
  TextArea,
} from '@admin-bro/design-system'
import styled from 'styled-components'

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

export const Container = styled(Box)``

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
