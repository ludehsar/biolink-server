import React, { useState } from 'react'
import { BasePropertyProps } from 'admin-bro'
import {
  FormGroup,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
} from '@admin-bro/design-system'

import { Title, FormInput, Container } from '../../../shared/components/Common.styled'
import { RoleSettings as Settings } from 'json-types'

const RoleSettings: React.FC<BasePropertyProps> = (props) => {
  const { record } = props
  const [settings] = useState<Settings[]>([
    {
      resource: record?.params['roleSettings.0.resource'] || 'Biolink',
      canCreate: record?.params['roleSettings.0.canCreate'] || false,
      canShow: record?.params['roleSettings.0.canShow'] || false,
      canShowList: record?.params['roleSettings.0.canShowList'] || false,
      canEdit: record?.params['roleSettings.0.canEdit'] || false,
      canDelete: record?.params['roleSettings.0.canDelete'] || false,
    },
    {
      resource: record?.params['roleSettings.1.resource'] || 'Black List',
      canCreate: record?.params['roleSettings.1.canCreate'] || false,
      canShow: record?.params['roleSettings.1.canShow'] || false,
      canShowList: record?.params['roleSettings.1.canShowList'] || false,
      canEdit: record?.params['roleSettings.1.canEdit'] || false,
      canDelete: record?.params['roleSettings.1.canDelete'] || false,
    },
    {
      resource: record?.params['roleSettings.2.resource'] || 'Category',
      canCreate: record?.params['roleSettings.2.canCreate'] || false,
      canShow: record?.params['roleSettings.2.canShow'] || false,
      canShowList: record?.params['roleSettings.2.canShowList'] || false,
      canEdit: record?.params['roleSettings.2.canEdit'] || false,
      canDelete: record?.params['roleSettings.2.canDelete'] || false,
    },
    {
      resource: record?.params['roleSettings.3.resource'] || 'Code',
      canCreate: record?.params['roleSettings.3.canCreate'] || false,
      canShow: record?.params['roleSettings.3.canShow'] || false,
      canShowList: record?.params['roleSettings.3.canShowList'] || false,
      canEdit: record?.params['roleSettings.3.canEdit'] || false,
      canDelete: record?.params['roleSettings.3.canDelete'] || false,
    },
    {
      resource: record?.params['roleSettings.4.resource'] || 'Domain',
      canCreate: record?.params['roleSettings.4.canCreate'] || false,
      canShow: record?.params['roleSettings.4.canShow'] || false,
      canShowList: record?.params['roleSettings.4.canShowList'] || false,
      canEdit: record?.params['roleSettings.4.canEdit'] || false,
      canDelete: record?.params['roleSettings.4.canDelete'] || false,
    },
    {
      resource: record?.params['roleSettings.5.resource'] || 'Link',
      canCreate: record?.params['roleSettings.5.canCreate'] || false,
      canShow: record?.params['roleSettings.5.canShow'] || false,
      canShowList: record?.params['roleSettings.5.canShowList'] || false,
      canEdit: record?.params['roleSettings.5.canEdit'] || false,
      canDelete: record?.params['roleSettings.5.canDelete'] || false,
    },
    {
      resource: record?.params['roleSettings.6.resource'] || 'Plan',
      canCreate: record?.params['roleSettings.6.canCreate'] || false,
      canShow: record?.params['roleSettings.6.canShow'] || false,
      canShowList: record?.params['roleSettings.6.canShowList'] || false,
      canEdit: record?.params['roleSettings.6.canEdit'] || false,
      canDelete: record?.params['roleSettings.6.canDelete'] || false,
    },
    {
      resource: record?.params['roleSettings.7.resource'] || 'Premium Username',
      canCreate: record?.params['roleSettings.7.canCreate'] || false,
      canShow: record?.params['roleSettings.7.canShow'] || false,
      canShowList: record?.params['roleSettings.7.canShowList'] || false,
      canEdit: record?.params['roleSettings.7.canEdit'] || false,
      canDelete: record?.params['roleSettings.7.canDelete'] || false,
    },
    {
      resource: record?.params['roleSettings.8.resource'] || 'Tax',
      canCreate: record?.params['roleSettings.8.canCreate'] || false,
      canShow: record?.params['roleSettings.8.canShow'] || false,
      canShowList: record?.params['roleSettings.8.canShowList'] || false,
      canEdit: record?.params['roleSettings.8.canEdit'] || false,
      canDelete: record?.params['roleSettings.8.canDelete'] || false,
    },
    {
      resource: record?.params['roleSettings.9.resource'] || 'User',
      canCreate: record?.params['roleSettings.9.canCreate'] || false,
      canShow: record?.params['roleSettings.9.canShow'] || false,
      canShowList: record?.params['roleSettings.9.canShowList'] || false,
      canEdit: record?.params['roleSettings.9.canEdit'] || false,
      canDelete: record?.params['roleSettings.9.canDelete'] || false,
    },
    {
      resource: record?.params['roleSettings.10.resource'] || 'Verification',
      canCreate: record?.params['roleSettings.10.canCreate'] || false,
      canShow: record?.params['roleSettings.10.canShow'] || false,
      canShowList: record?.params['roleSettings.10.canShowList'] || false,
      canEdit: record?.params['roleSettings.10.canEdit'] || false,
      canDelete: record?.params['roleSettings.10.canDelete'] || false,
    },
    {
      resource: record?.params['roleSettings.11.resource'] || 'User Logs',
      canCreate: record?.params['roleSettings.11.canCreate'] || false,
      canShow: record?.params['roleSettings.11.canShow'] || false,
      canShowList: record?.params['roleSettings.11.canShowList'] || false,
      canEdit: record?.params['roleSettings.11.canEdit'] || false,
      canDelete: record?.params['roleSettings.11.canDelete'] || false,
    },
  ])

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
                    name="canCreate"
                    checked={singleSettings.canCreate}
                    readOnly
                  />
                </FormGroup>
              </TableCell>
              <TableCell>
                <FormGroup>
                  <FormInput
                    type="checkbox"
                    name="canShow"
                    checked={singleSettings.canShow}
                    readOnly
                  />
                </FormGroup>
              </TableCell>
              <TableCell>
                <FormGroup>
                  <FormInput
                    type="checkbox"
                    name="canShowList"
                    checked={singleSettings.canShowList}
                    readOnly
                  />
                </FormGroup>
              </TableCell>
              <TableCell>
                <FormGroup>
                  <FormInput
                    type="checkbox"
                    name="canEdit"
                    checked={singleSettings.canEdit}
                    readOnly
                  />
                </FormGroup>
              </TableCell>
              <TableCell>
                <FormGroup>
                  <FormInput
                    type="checkbox"
                    name="canDelete"
                    checked={singleSettings.canDelete}
                    readOnly
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
