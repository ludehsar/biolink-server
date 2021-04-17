import { FormGroup } from '@admin-bro/design-system'
import React from 'react'

import {
  Title,
  FormCTAGroup,
  FormHelper,
  FormLabel,
  FormSubmitButton,
  FormTextArea,
  SettingsTabContainer,
} from './CommonSettings.styled'
import { CommonSettingsProps } from './CommonSettingsProps'

const AdsSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id } = props
  return (
    <SettingsTabContainer {...{ className, id }}>
      <Title>
        <FormHelper>These fields accept text or html.</FormHelper>
      </Title>
      <FormGroup>
        <FormLabel>Header</FormLabel>
        <FormTextArea />
      </FormGroup>

      <FormGroup>
        <FormLabel>Footer</FormLabel>
        <FormTextArea />
      </FormGroup>

      <FormGroup>
        <FormLabel>Biolink Page Header</FormLabel>
        <FormTextArea />
      </FormGroup>

      <FormGroup>
        <FormLabel>Biolink Page Footer</FormLabel>
        <FormTextArea />
      </FormGroup>

      <FormCTAGroup>
        <FormSubmitButton>Update</FormSubmitButton>
      </FormCTAGroup>
    </SettingsTabContainer>
  )
}

export default AdsSettings
