import { FormGroup } from '@admin-bro/design-system'
import { withNotice } from 'admin-bro'
import { Formik, Form } from 'formik'
import React from 'react'

import {
  FormCTAGroup,
  FormInput,
  FormLabel,
  FormSubmitButton,
  MainTabContainer,
} from '../../shared/components/Common.styled'
import { CommonSettingsProps } from './CommonSettingsProps'
import { FacebookSystemSettings } from '../../../models/jsonTypes/FacebookSystemSettings'
import { saveFacebookLoginSettings } from '../actions/facebookSettingsAction'

const FacebookSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id, value, addNotice } = props

  const handleSubmit = async (values: FacebookSystemSettings): Promise<void> => {
    await saveFacebookLoginSettings(values).catch(() => {
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
          enableFacebookLogin: (value as FacebookSystemSettings)?.enableFacebookLogin || 'no',
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values as FacebookSystemSettings)
          setSubmitting(false)
          return
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit} method="post">
            <FormGroup>
              <FormLabel>Enable Facebook Login</FormLabel>
              <FormInput
                as="select"
                name="enableFacebookLogin"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.enableFacebookLogin}
              >
                <FormInput as="option" value={'yes'}>
                  Yes
                </FormInput>
                <FormInput as="option" value={'no'}>
                  No
                </FormInput>
              </FormInput>
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

export default withNotice(FacebookSettings)
