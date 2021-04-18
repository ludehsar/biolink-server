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
  SettingsTabContainer,
} from './CommonSettings.styled'
import { CommonSettingsProps } from './CommonSettingsProps'
import { saveMainSettings } from '../actions/mainSettingsAction'
import { MainSystemSettings } from '../../../models/jsonTypes/MainSystemSettings'

const MainSettings: React.FC<CommonSettingsProps> = ({ addNotice, ...props }) => {
  const { className, id, value } = props

  const handleSubmit = async (values: MainSystemSettings): Promise<void> => {
    await saveMainSettings(values).catch((err) => {
      addNotice({
        message: err.message,
        type: 'error',
      })
      return
    })
    addNotice({
      message: 'Successfully updated main settings',
      type: 'success',
    })
  }

  return (
    <SettingsTabContainer {...{ className, id }}>
      <Formik
        enableReinitialize={true}
        initialValues={{
          title: value?.title || '',
          defaultLanguage: value?.defaultLanguage || 'english',
          defaultTimezone: value?.defaultTimezone || 'utc',
          enableEmailConfirmation: value?.enableEmailConfirmation || '',
          enableNewUserRegistration: value?.enableNewUserRegistration || '',
          termsAndConditionsUrl: value?.termsAndConditionsUrl || '',
          privacyPolicyUrl: value?.privacyPolicyUrl || '',
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values as MainSystemSettings)
          setSubmitting(false)
          return
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
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
                value={values.enableEmailConfirmation ? 'yes' : 'no'}
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
                value={values.enableNewUserRegistration ? 'yes' : 'no'}
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
    </SettingsTabContainer>
  )
}

export default withNotice(MainSettings)
