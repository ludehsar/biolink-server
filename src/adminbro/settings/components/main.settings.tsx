import React from 'react'
import { FormGroup } from '@admin-bro/design-system'
import { Form, Formik } from 'formik'
import { withNotice } from 'admin-bro'

import {
  FileUploader,
  FormCTAGroup,
  FormHelper,
  FormInput,
  FormLabel,
  FormSubmitButton,
  MainTabContainer,
} from '../../shared/components/Common.styled'
import { CommonSettingsProps } from './CommonSettingsProps'
import { saveMainSettings } from '../actions/mainSettingsAction'
import { MainSystemSettings } from '../../../models/jsonTypes/MainSystemSettings'

const MainSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id, value, addNotice } = props

  const handleSubmit = async (values: MainSystemSettings): Promise<void> => {
    await saveMainSettings(values).catch(() => {
      addNotice({
        message: 'Unable to save data to the database.',
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
    <MainTabContainer {...{ className, id }}>
      <Formik
        enableReinitialize={true}
        initialValues={{
          title: (value as MainSystemSettings)?.title || '',
          defaultLanguage: (value as MainSystemSettings)?.defaultLanguage || 'english',
          websiteLogoUrl: (value as MainSystemSettings)?.websiteLogoUrl || '',
          faviconLogoUrl: (value as MainSystemSettings)?.faviconLogoUrl || '',
          defaultTimezone: (value as MainSystemSettings)?.defaultTimezone || 'utc',
          enableEmailConfirmation: (value as MainSystemSettings)?.enableEmailConfirmation || 'no',
          enableNewUserRegistration:
            (value as MainSystemSettings)?.enableNewUserRegistration || 'no',
          termsAndConditionsUrl: (value as MainSystemSettings)?.termsAndConditionsUrl || '',
          privacyPolicyUrl: (value as MainSystemSettings)?.privacyPolicyUrl || '',
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values as MainSystemSettings)
          setSubmitting(false)
          return
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit} method="post">
            <FormGroup>
              <FormLabel>Website Title</FormLabel>
              <FormInput
                type="text"
                name="title"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Default Language</FormLabel>
              <FormInput
                as="select"
                name="defaultLanguage"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.defaultLanguage}
              >
                <FormInput as="option" value="english">
                  English
                </FormInput>
              </FormInput>
            </FormGroup>

            <FormGroup>
              <FormLabel>Website Logo</FormLabel>
              <FileUploader />
            </FormGroup>

            <FormGroup>
              <FormLabel>Favicon</FormLabel>
              <FileUploader />
            </FormGroup>

            <FormGroup>
              <FormLabel>Default Timezone</FormLabel>
              <FormInput
                as="select"
                name="defaultTimezone"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.defaultTimezone}
              >
                <FormInput as="option" value="utc">
                  UTC
                </FormInput>
              </FormInput>
            </FormGroup>

            <FormGroup>
              <FormLabel>Email Confirmation</FormLabel>
              <FormInput
                as="select"
                name="enableEmailConfirmation"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.enableEmailConfirmation}
              >
                <FormInput as="option" value={'yes'}>
                  Yes
                </FormInput>
                <FormInput as="option" value={'no'}>
                  No
                </FormInput>
              </FormInput>
              <FormHelper>
                Send out email confirmation when a user registers or changes his email address.
              </FormHelper>
            </FormGroup>

            <FormGroup>
              <FormLabel>Enable New User Registration</FormLabel>
              <FormInput
                as="select"
                name="enableNewUserRegistration"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.enableNewUserRegistration}
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
              <FormLabel>Terms and Conditions URL</FormLabel>
              <FormInput
                type="text"
                name="termsAndConditionsUrl"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.termsAndConditionsUrl}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Privacy Policy URL</FormLabel>
              <FormInput
                type="text"
                name="privacyPolicyUrl"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.privacyPolicyUrl}
              />
            </FormGroup>

            <FormCTAGroup>
              <FormSubmitButton type="submit" disabled={isSubmitting}>
                Update
              </FormSubmitButton>
            </FormCTAGroup>
          </Form>
        )}
      </Formik>
    </MainTabContainer>
  )
}

export default withNotice(MainSettings)
