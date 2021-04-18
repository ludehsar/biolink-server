import { FormGroup } from '@admin-bro/design-system'
import { withNotice } from 'admin-bro'
import { Formik, Form } from 'formik'
import { LinkSystemSettings } from 'models/jsonTypes/LinkSystemSettings'
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
} from './CommonSettings.styled'
import { CommonSettingsProps } from './CommonSettingsProps'

const LinkSettings: React.FC<CommonSettingsProps> = ({ addNotice, ...props }) => {
  const { className, id, value } = props

  const handleSubmit = async (values: LinkSystemSettings): Promise<void> => {
    await saveLinkSettings(values).catch(() => {
      addNotice({
        message: 'Unable to save data to the database',
        type: 'error',
      })
      return
    })
    addNotice({
      message: 'Successfully updated link settings',
      type: 'success',
    })
  }

  return (
    <SettingsTabContainer {...{ className, id }}>
      <Formik
        enableReinitialize={true}
        initialValues={{
          branding: (value as LinkSystemSettings)?.branding || '',
          enableLinkShortenerSystem:
            (value as LinkSystemSettings)?.enableLinkShortenerSystem || false,
          enableCustomDomainSystem:
            (value as LinkSystemSettings)?.enableCustomDomainSystem || false,
          enableMainDomainUsage: (value as LinkSystemSettings)?.enableMainDomainUsage || false,
          blacklistedDomains: (((value as LinkSystemSettings)?.blacklistedDomains as []) || [])
            .join('\n')
            .toString(),
          blacklistedKeywords: ((value as LinkSystemSettings)?.blacklistedKeywords || [])
            .join('\n')
            .toString(),
          enablePhishtank: (value as LinkSystemSettings)?.enablePhishtank || false,
          enableGoogleSafeBrowsing:
            (value as LinkSystemSettings)?.enableGoogleSafeBrowsing || false,
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
          handleSubmit(newValues as LinkSystemSettings)
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
                value={values.enableLinkShortenerSystem as string}
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
                value={values.enableCustomDomainSystem as string}
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
                value={values.enableMainDomainUsage as string}
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
                value={values.enablePhishtank as string}
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
                value={values.enableGoogleSafeBrowsing as string}
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
