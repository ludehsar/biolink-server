import { FormGroup } from '@admin-bro/design-system'
import { withNotice } from 'admin-bro'
import { Formik, Form } from 'formik'
import { BiolinkSystemSettings } from 'models/jsonTypes/BiolinkSystemSettings'
import React from 'react'
import { saveLinkSettings } from '../actions/linkSettingsAction'

import {
  FormCTAGroup,
  FormHelper,
  FormInput,
  FormLabel,
  FormSubmitButton,
  FormTextArea,
  SettingsTabContainer,
} from '../../shared/components/Common.styled'
import { CommonSettingsProps } from './CommonSettingsProps'

const LinkSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id, value, addNotice } = props

  const handleSubmit = async (values: BiolinkSystemSettings): Promise<void> => {
    await saveLinkSettings(values).catch(() => {
      addNotice({
        message: 'Unable to save data to the database',
        type: 'error',
      })
      return
    })
    addNotice({
      message: 'Successfully updated settings',
      type: 'success',
    })
  }

  return (
    <SettingsTabContainer {...{ className, id }}>
      <Formik
        enableReinitialize={true}
        initialValues={{
          branding: (value as BiolinkSystemSettings)?.branding || '',
          enableLinkShortenerSystem:
            (value as BiolinkSystemSettings)?.enableLinkShortenerSystem || 'no',
          enableCustomDomainSystem:
            (value as BiolinkSystemSettings)?.enableCustomDomainSystem || 'no',
          enableMainDomainUsage: (value as BiolinkSystemSettings)?.enableMainDomainUsage || 'no',
          blacklistedDomains: ((value as BiolinkSystemSettings)?.blacklistedDomains || [])
            .join('\n')
            .toString(),
          blacklistedKeywords: ((value as BiolinkSystemSettings)?.blacklistedKeywords || [])
            .join('\n')
            .toString(),
          enablePhishtank: (value as BiolinkSystemSettings)?.enablePhishtank || 'no',
          enableGoogleSafeBrowsing:
            (value as BiolinkSystemSettings)?.enableGoogleSafeBrowsing || 'no',
        }}
        onSubmit={(values, { setSubmitting }) => {
          const blacklistedDomains = values.blacklistedDomains.split('\n')
          const blacklistedKeywords = values.blacklistedKeywords.split('\n')
          blacklistedDomains.sort()
          blacklistedKeywords.sort()

          const newValues = {
            ...values,
            blacklistedDomains,
            blacklistedKeywords,
          }
          handleSubmit(newValues as BiolinkSystemSettings)
          setSubmitting(false)
          return
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit} method="post">
            <FormGroup>
              <FormLabel>Branding</FormLabel>
              <FormInput
                type="text"
                name="branding"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.branding}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Enable the Link Shortener System</FormLabel>
              <FormInput
                as="select"
                name="enableLinkShortenerSystem"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.enableLinkShortenerSystem}
              >
                <FormInput as="option" value={'yes'}>
                  Yes
                </FormInput>
                <FormInput as="option" value={'no'}>
                  No
                </FormInput>
              </FormInput>
            </FormGroup>

            <FormGroup>
              <FormLabel>Enable the Custom Domain System</FormLabel>
              <FormInput
                as="select"
                name="enableCustomDomainSystem"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.enableCustomDomainSystem}
              >
                <FormInput as="option" value={'yes'}>
                  Yes
                </FormInput>
                <FormInput as="option" value={'no'}>
                  No
                </FormInput>
              </FormInput>
            </FormGroup>

            <FormGroup>
              <FormLabel>Enable the Usage of Main Domain</FormLabel>
              <FormInput
                as="select"
                name="enableMainDomainUsage"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.enableMainDomainUsage}
              >
                <FormInput as="option" value={'yes'}>
                  Yes
                </FormInput>
                <FormInput as="option" value={'no'}>
                  No
                </FormInput>
              </FormInput>
            </FormGroup>

            <FormGroup>
              <FormLabel>Blacklisted Domains</FormLabel>
              <FormTextArea
                name="blacklistedDomains"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.blacklistedDomains}
              />
              <FormHelper>Put blacklisted domains in new line.</FormHelper>
            </FormGroup>

            <FormGroup>
              <FormLabel>Blacklisted Keywords</FormLabel>
              <FormTextArea
                name="blacklistedKeywords"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.blacklistedKeywords}
              />
              <FormHelper>Put blacklisted keywords in new line.</FormHelper>
            </FormGroup>

            <FormGroup>
              <FormLabel>Is Phishtank Enabled</FormLabel>
              <FormInput
                as="select"
                name="enablePhishtank"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.enablePhishtank}
              >
                <FormInput as="option" value={'yes'}>
                  Yes
                </FormInput>
                <FormInput as="option" value={'no'}>
                  No
                </FormInput>
              </FormInput>
              <FormHelper>Include phishtank API keys in the environment variables.</FormHelper>
            </FormGroup>

            <FormGroup>
              <FormLabel>Is Google Safe Browse Enabled</FormLabel>
              <FormInput
                as="select"
                name="enableGoogleSafeBrowsing"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.enableGoogleSafeBrowsing}
              >
                <FormInput as="option" value={'yes'}>
                  Yes
                </FormInput>
                <FormInput as="option" value={'no'}>
                  No
                </FormInput>
              </FormInput>
              <FormHelper>
                Include Google Safebrowsing API keys in the environment variables.
              </FormHelper>
            </FormGroup>

            <FormCTAGroup>
              <FormSubmitButton type="submit" disabled={isSubmitting}>
                Update
              </FormSubmitButton>
            </FormCTAGroup>
          </Form>
        )}
      </Formik>
    </SettingsTabContainer>
  )
}

export default withNotice(LinkSettings)
