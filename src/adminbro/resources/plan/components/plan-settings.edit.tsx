import { BasePropertyProps, OnPropertyChange } from 'admin-bro'
import { FormGroup } from '@admin-bro/design-system'
import React, { useCallback, useState, useEffect, ChangeEvent } from 'react'

import {
  Container,
  FormLabel,
  Title,
  FormInput,
  FormHelper,
} from '../../../shared/components/Common.styled'
import { PlanSettings as Settings } from 'json-types'

const PlanSettings: React.FC<BasePropertyProps> = (props) => {
  const { property, record, onChange } = props
  const [settings, setSettings] = useState<Settings>({
    totalBiolinksLimit: record?.params['settings.totalBiolinksLimit'] || 0,
    totalLinksLimit: record?.params['settings.totalLinksLimit'] || 0,
    totalCustomDomainLimit: record?.params['settings.totalCustomDomainLimit'] || 0,
    darkModeEnabled: record?.params['settings.darkModeEnabled'] || false, //
    addedToDirectoryEnabled: record?.params['settings.addedToDirectoryEnabled'] || false, //
    customBackHalfEnabled: record?.params['settings.customBackHalfEnabled'] || false,
    noAdsEnabled: record?.params['settings.noAdsEnabled'] || false,
    removableBrandingEnabled: record?.params['settings.removableBrandingEnabled'] || false,
    customFooterBrandingEnabled: record?.params['settings.customFooterBrandingEnabled'] || false,
    coloredLinksEnabled: record?.params['settings.coloredLinksEnabled'] || false,
    googleAnalyticsEnabled: record?.params['settings.googleAnalyticsEnabled'] || false,
    facebookPixelEnabled: record?.params['settings.facebookPixelEnabled'] || false,
    emailCaptureEnabled: record?.params['settings.emailCaptureEnabled'] || false, //
    verifiedCheckmarkEnabled: record?.params['settings.verifiedCheckmarkEnabled'] || false,
    linksSchedulingEnabled: record?.params['settings.linksSchedulingEnabled'] || false,
    seoEnabled: record?.params['settings.seoEnabled'] || false,
    socialEnabled: record?.params['settings.socialEnabled'] || false,
    utmParametersEnabled: record?.params['settings.utmParametersEnabled'] || false,
    passwordProtectionEnabled: record?.params['settings.passwordProtectionEnabled'] || false,
    sensitiveContentWarningEnabled:
      record?.params['settings.sensitiveContentWarningEnabled'] || false,
    leapLinkEnabled: record?.params['settings.leapLinkEnabled'] || false,
    donationLinkEnabled: record?.params['settings.donationLinkEnabled'] || false, //
  })

  const updateFormValue = useCallback(
    (event = undefined) => {
      if (event === undefined) return
      setSettings({
        ...settings,
        [event.target.name]: event.target.value,
      })
    },
    [settings]
  )

  useEffect(() => {
    updateFormValue()
    ;(onChange as OnPropertyChange)(property.name, settings)
  }, [onChange, property.name, settings, updateFormValue])

  return (
    <Container>
      <Title>Plan Settings</Title>
      <FormGroup>
        <FormLabel>Total Biolinks Limit</FormLabel>
        <FormInput
          type="number"
          name="totalBiolinksLimit"
          defaultValue={settings.totalBiolinksLimit}
          onChange={(event: React.FormEvent<HTMLInputElement>) => {
            updateFormValue(event)
          }}
        />
        <FormHelper>
          The total amount of biolink pages that a user can create. Set -1 for unlimited.
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Total Links Limit</FormLabel>
        <FormInput
          type="number"
          name="totalLinksLimit"
          defaultValue={settings.totalLinksLimit}
          onChange={(event: React.FormEvent<HTMLInputElement>) => {
            updateFormValue(event)
          }}
        />
        <FormHelper>
          The total amount of links that a user can create (shorted links). Set -1 for unlimited.
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Total Custom Domains Limit</FormLabel>
        <FormInput
          type="number"
          name="totalCustomDomainLimit"
          defaultValue={settings.totalCustomDomainLimit}
          onChange={(event: React.FormEvent<HTMLInputElement>) => {
            updateFormValue(event)
          }}
        />
        <FormHelper>
          The total amount of custom domains that a user can add. Set -1 for unlimited.
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable Custom Back Half</FormLabel>
        <FormInput
          as="select"
          name="customBackHalfEnabled"
          defaultValue={settings.customBackHalfEnabled}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            updateFormValue(event)
          }}
        >
          <FormInput as="option" value={'yes'}>
            Yes
          </FormInput>
          <FormInput as="option" value={false}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>
          Enabling this will give the ability to the user to have custom url aliases instead of auto
          generated ones.
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>No Ads</FormLabel>
        <FormInput
          as="select"
          name="noAdsEnabled"
          defaultValue={settings.noAdsEnabled}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            updateFormValue(event)
          }}
        >
          <FormInput as="option" value={'yes'}>
            Yes
          </FormInput>
          <FormInput as="option" value={false}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>
          Enabling this will make all people having this plan to not see any ads.
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Remove Branding</FormLabel>
        <FormInput
          as="select"
          name="removableBrandingEnabled"
          defaultValue={settings.removableBrandingEnabled}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            updateFormValue(event)
          }}
        >
          <FormInput as="option" value={'yes'}>
            Yes
          </FormInput>
          <FormInput as="option" value={false}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>
          This gives the option for people to remove branding from the biolinks page.
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Custom Branding</FormLabel>
        <FormInput
          as="select"
          name="customFooterBrandingEnabled"
          defaultValue={settings.customFooterBrandingEnabled}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            updateFormValue(event)
          }}
        >
          <FormInput as="option" value={'yes'}>
            Yes
          </FormInput>
          <FormInput as="option" value={false}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>
          This gives the option for people to add their custom branding for the biolinks footer.
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Colored Links</FormLabel>
        <FormInput
          as="select"
          name="coloredLinksEnabled"
          defaultValue={settings.coloredLinksEnabled}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            updateFormValue(event)
          }}
        >
          <FormInput as="option" value={'yes'}>
            Yes
          </FormInput>
          <FormInput as="option" value={false}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>
          Gives the user the ability to customize the color of their biolinks links.
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Google Analytics</FormLabel>
        <FormInput
          as="select"
          name="googleAnalyticsEnabled"
          defaultValue={settings.googleAnalyticsEnabled}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            updateFormValue(event)
          }}
        >
          <FormInput as="option" value={'yes'}>
            Yes
          </FormInput>
          <FormInput as="option" value={false}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>
          Gives the user the ability to add Google Analytics on their biolinks pages.
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Facebook Pixel</FormLabel>
        <FormInput
          as="select"
          name="facebookPixelEnabled"
          defaultValue={settings.facebookPixelEnabled}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            updateFormValue(event)
          }}
        >
          <FormInput as="option" value={'yes'}>
            Yes
          </FormInput>
          <FormInput as="option" value={false}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>
          Gives the user the ability to add Facebook Pixel on their biolinks pages.
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Verified Checkmark Enabled</FormLabel>
        <FormInput
          as="select"
          name="verifiedCheckmarkEnabled"
          defaultValue={settings.verifiedCheckmarkEnabled}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            updateFormValue(event)
          }}
        >
          <FormInput as="option" value={'yes'}>
            Yes
          </FormInput>
          <FormInput as="option" value={false}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>Gives the user the verified checkmark on all their Biolink pages.</FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Link Scheduling</FormLabel>
        <FormInput
          as="select"
          name="linksSchedulingEnabled"
          defaultValue={settings.linksSchedulingEnabled}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            updateFormValue(event)
          }}
        >
          <FormInput as="option" value={'yes'}>
            Yes
          </FormInput>
          <FormInput as="option" value={false}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>Gives the user the ability to schedule links.</FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable SEO</FormLabel>
        <FormInput
          as="select"
          name="seoEnabled"
          defaultValue={settings.seoEnabled}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            updateFormValue(event)
          }}
        >
          <FormInput as="option" value={'yes'}>
            Yes
          </FormInput>
          <FormInput as="option" value={false}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>
          Gives the user the ability to change the Title and Meta Description of Biolink pages.
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Socials</FormLabel>
        <FormInput
          as="select"
          name="socialEnabled"
          defaultValue={settings.socialEnabled}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            updateFormValue(event)
          }}
        >
          <FormInput as="option" value={'yes'}>
            Yes
          </FormInput>
          <FormInput as="option" value={false}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>
          Gives the user the ability to add his social media accounts and be displayed below the
          biolink links.
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>UTM Parameters</FormLabel>
        <FormInput
          as="select"
          name="utmParametersEnabled"
          defaultValue={settings.utmParametersEnabled}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            updateFormValue(event)
          }}
        >
          <FormInput as="option" value={'yes'}>
            Yes
          </FormInput>
          <FormInput as="option" value={false}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>
          Gives the user the ability to set global UTM parameters for all the links inside of a
          Biolink page.
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Password Protection</FormLabel>
        <FormInput
          as="select"
          name="passwordProtectionEnabled"
          defaultValue={settings.passwordProtectionEnabled}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            updateFormValue(event)
          }}
        >
          <FormInput as="option" value={'yes'}>
            Yes
          </FormInput>
          <FormInput as="option" value={false}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>Gives the user the ability to password protect their links.</FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Sensitive Content Warning</FormLabel>
        <FormInput
          as="select"
          name="sensitiveContentWarningEnabled"
          defaultValue={settings.sensitiveContentWarningEnabled}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            updateFormValue(event)
          }}
        >
          <FormInput as="option" value={'yes'}>
            Yes
          </FormInput>
          <FormInput as="option" value={false}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>
          Gives the user the ability to enable a sensitive content warning on their links.
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Leap Link</FormLabel>
        <FormInput
          as="select"
          name="leapLinkEnabled"
          defaultValue={settings.leapLinkEnabled}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            updateFormValue(event)
          }}
        >
          <FormInput as="option" value={'yes'}>
            Yes
          </FormInput>
          <FormInput as="option" value={false}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>
          Gives the user the ability to enable a sensitive content warning on their links.
        </FormHelper>
      </FormGroup>
    </Container>
  )
}

export default PlanSettings
