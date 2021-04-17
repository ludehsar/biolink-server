import { FormGroup } from '@admin-bro/design-system'
import React from 'react'

import {
  FormCTAGroup,
  FormHelper,
  FormInput,
  FormLabel,
  FormSubmitButton,
  FormTextArea,
  SettingsTabContainer,
} from './CommonSettings.styled'
import { CommonSettingsProps } from './CommonSettingsProps'

const LinkSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id } = props
  return (
    <SettingsTabContainer {...{ className, id }}>
      <FormGroup>
        <FormLabel>Branding</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable the Link Shortener System</FormLabel>
        <FormInput as="select">
          <FormInput as="option" value={1}>
            Yes
          </FormInput>
          <FormInput as="option" value={0}>
            No
          </FormInput>
        </FormInput>
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable the Custom Domain System</FormLabel>
        <FormInput as="select">
          <FormInput as="option" value={1}>
            Yes
          </FormInput>
          <FormInput as="option" value={0}>
            No
          </FormInput>
        </FormInput>
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable the Usage of Main Domain</FormLabel>
        <FormInput as="select">
          <FormInput as="option" value={1}>
            Yes
          </FormInput>
          <FormInput as="option" value={0}>
            No
          </FormInput>
        </FormInput>
      </FormGroup>

      <FormGroup>
        <FormLabel>Blacklisted Domains</FormLabel>
        <FormTextArea />
        <FormHelper>Put comma separated blacklisted domains.</FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Blacklisted Keywords</FormLabel>
        <FormTextArea />
        <FormHelper>Put comma separated blacklisted keywords.</FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Is Phishtank Enabled</FormLabel>
        <FormInput as="select">
          <FormInput as="option" value={1}>
            Yes
          </FormInput>
          <FormInput as="option" value={0}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>Include phishtank API keys in the environment variables.</FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Is Google Safe Browse Enabled</FormLabel>
        <FormInput as="select">
          <FormInput as="option" value={1}>
            Yes
          </FormInput>
          <FormInput as="option" value={0}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>Include Google Safebrowsing API keys in the environment variables.</FormHelper>
      </FormGroup>

      <FormCTAGroup>
        <FormSubmitButton>Update</FormSubmitButton>
      </FormCTAGroup>
    </SettingsTabContainer>
  )
}

export default LinkSettings
