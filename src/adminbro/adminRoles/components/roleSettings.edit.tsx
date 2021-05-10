import React, { useCallback, useEffect, useState } from 'react'
import { BasePropertyProps, OnPropertyChange } from 'admin-bro'
import {
  FormGroup,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
} from '@admin-bro/design-system'

import { Title, FormInput, Container } from '../../shared/components/Common.styled'
import { RoleSettings as Settings } from '../../../models/jsonTypes/RoleSettings'

const RoleSettings: React.FC<BasePropertyProps> = (props) => {
  const { property, record, onChange } = props
  const [settings, setSettings] = useState<Settings[]>([
    {
      resource: record?.params['roleSettings.0.resource'] || 'Biolink',
      canCreate: record?.params['roleSettings.0.canCreate'] === 'true' || false,
      canShow: record?.params['roleSettings.0.canShow'] === 'true' || false,
      canShowList: record?.params['roleSettings.0.canShowList'] === 'true' || false,
      canEdit: record?.params['roleSettings.0.canEdit'] === 'true' || false,
      canDelete: record?.params['roleSettings.0.canDelete'] === 'true' || false,
    },
    {
      resource: record?.params['roleSettings.1.resource'] || 'Black List',
      canCreate: record?.params['roleSettings.1.canCreate'] === 'true' || false,
      canShow: record?.params['roleSettings.1.canShow'] === 'true' || false,
      canShowList: record?.params['roleSettings.1.canShowList'] === 'true' || false,
      canEdit: record?.params['roleSettings.1.canEdit'] === 'true' || false,
      canDelete: record?.params['roleSettings.1.canDelete'] === 'true' || false,
    },
    {
      resource: record?.params['roleSettings.2.resource'] || 'Category',
      canCreate: record?.params['roleSettings.2.canCreate'] === 'true' || false,
      canShow: record?.params['roleSettings.2.canShow'] === 'true' || false,
      canShowList: record?.params['roleSettings.2.canShowList'] === 'true' || false,
      canEdit: record?.params['roleSettings.2.canEdit'] === 'true' || false,
      canDelete: record?.params['roleSettings.2.canDelete'] === 'true' || false,
    },
    {
      resource: record?.params['roleSettings.3.resource'] || 'Code',
      canCreate: record?.params['roleSettings.3.canCreate'] === 'true' || false,
      canShow: record?.params['roleSettings.3.canShow'] === 'true' || false,
      canShowList: record?.params['roleSettings.3.canShowList'] === 'true' || false,
      canEdit: record?.params['roleSettings.3.canEdit'] === 'true' || false,
      canDelete: record?.params['roleSettings.3.canDelete'] === 'true' || false,
    },
    {
      resource: record?.params['roleSettings.4.resource'] || 'Domain',
      canCreate: record?.params['roleSettings.4.canCreate'] === 'true' || false,
      canShow: record?.params['roleSettings.4.canShow'] === 'true' || false,
      canShowList: record?.params['roleSettings.4.canShowList'] === 'true' || false,
      canEdit: record?.params['roleSettings.4.canEdit'] === 'true' || false,
      canDelete: record?.params['roleSettings.4.canDelete'] === 'true' || false,
    },
    {
      resource: record?.params['roleSettings.5.resource'] || 'Link',
      canCreate: record?.params['roleSettings.5.canCreate'] === 'true' || false,
      canShow: record?.params['roleSettings.5.canShow'] === 'true' || false,
      canShowList: record?.params['roleSettings.5.canShowList'] === 'true' || false,
      canEdit: record?.params['roleSettings.5.canEdit'] === 'true' || false,
      canDelete: record?.params['roleSettings.5.canDelete'] === 'true' || false,
    },
    {
      resource: record?.params['roleSettings.6.resource'] || 'Plan',
      canCreate: record?.params['roleSettings.6.canCreate'] === 'true' || false,
      canShow: record?.params['roleSettings.6.canShow'] === 'true' || false,
      canShowList: record?.params['roleSettings.6.canShowList'] === 'true' || false,
      canEdit: record?.params['roleSettings.6.canEdit'] === 'true' || false,
      canDelete: record?.params['roleSettings.6.canDelete'] === 'true' || false,
    },
    {
      resource: record?.params['roleSettings.7.resource'] || 'Premium Username',
      canCreate: record?.params['roleSettings.7.canCreate'] === 'true' || false,
      canShow: record?.params['roleSettings.7.canShow'] === 'true' || false,
      canShowList: record?.params['roleSettings.7.canShowList'] === 'true' || false,
      canEdit: record?.params['roleSettings.7.canEdit'] === 'true' || false,
      canDelete: record?.params['roleSettings.7.canDelete'] === 'true' || false,
    },
    {
      resource: record?.params['roleSettings.8.resource'] || 'Tax',
      canCreate: record?.params['roleSettings.8.canCreate'] === 'true' || false,
      canShow: record?.params['roleSettings.8.canShow'] === 'true' || false,
      canShowList: record?.params['roleSettings.8.canShowList'] === 'true' || false,
      canEdit: record?.params['roleSettings.8.canEdit'] === 'true' || false,
      canDelete: record?.params['roleSettings.8.canDelete'] === 'true' || false,
    },
    {
      resource: record?.params['roleSettings.9.resource'] || 'User',
      canCreate: record?.params['roleSettings.9.canCreate'] === 'true' || false,
      canShow: record?.params['roleSettings.9.canShow'] === 'true' || false,
      canShowList: record?.params['roleSettings.9.canShowList'] === 'true' || false,
      canEdit: record?.params['roleSettings.9.canEdit'] === 'true' || false,
      canDelete: record?.params['roleSettings.9.canDelete'] === 'true' || false,
    },
    {
      resource: record?.params['roleSettings.10.resource'] || 'Verification',
      canCreate: record?.params['roleSettings.10.canCreate'] === 'true' || false,
      canShow: record?.params['roleSettings.10.canShow'] === 'true' || false,
      canShowList: record?.params['roleSettings.10.canShowList'] === 'true' || false,
      canEdit: record?.params['roleSettings.10.canEdit'] === 'true' || false,
      canDelete: record?.params['roleSettings.10.canDelete'] === 'true' || false,
    },
  ])

  const updateFormValue = useCallback(
    (event = undefined, id = 0) => {
      if (event === undefined) return
      const items = [...settings]
      const item = { ...items[id] }
      item[event.target.name as 'canCreate' | 'canShow' | 'canShowList' | 'canEdit' | 'canDelete'] =
        event.target.checked
      items[id] = item
      setSettings(items)
    },
    [settings]
  )

  useEffect(() => {
    updateFormValue()
    ;(onChange as OnPropertyChange)(property.name, settings)
  }, [onChange, property.name, settings, updateFormValue])

  return (
    <Container>
      <Title>Role Settings</Title>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Resource Name</TableCell>
            <TableCell>Can Create</TableCell>
            <TableCell>Can See</TableCell>
            <TableCell>Can See List</TableCell>
            <TableCell>Can Edit</TableCell>
            <TableCell>Can Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {settings.map((singleSettings, id) => (
            <TableRow key={id}>
              <TableCell>{singleSettings.resource}</TableCell>
              <TableCell>
                <FormGroup>
                  <FormInput
                    type="checkbox"
                    name={'canCreate'}
                    checked={singleSettings.canCreate}
                    onChange={(event) => {
                      updateFormValue(event, id)
                    }}
                  />
                </FormGroup>
              </TableCell>
              <TableCell>
                <FormGroup>
                  <FormInput
                    type="checkbox"
                    name={'canShow'}
                    checked={singleSettings.canShow}
                    onChange={(event) => {
                      updateFormValue(event, id)
                    }}
                  />
                </FormGroup>
              </TableCell>
              <TableCell>
                <FormGroup>
                  <FormInput
                    type="checkbox"
                    name={'canShowList'}
                    checked={singleSettings.canShowList}
                    onChange={(event) => {
                      updateFormValue(event, id)
                    }}
                  />
                </FormGroup>
              </TableCell>
              <TableCell>
                <FormGroup>
                  <FormInput
                    type="checkbox"
                    name={'canEdit'}
                    checked={singleSettings.canEdit}
                    onChange={(event) => {
                      updateFormValue(event, id)
                    }}
                  />
                </FormGroup>
              </TableCell>
              <TableCell>
                <FormGroup>
                  <FormInput
                    type="checkbox"
                    name={'canDelete'}
                    checked={singleSettings.canDelete}
                    onChange={(event) => {
                      updateFormValue(event, id)
                    }}
                  />
                </FormGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  )
}

export default RoleSettings
