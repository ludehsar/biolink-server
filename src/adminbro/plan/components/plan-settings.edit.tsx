import { BasePropertyProps } from 'admin-bro'
import { FormGroup } from '@admin-bro/design-system'
import React from 'react'

import { Container, FormLabel, Title } from '../../shared/components/Common.styled'

const PlanSettings: React.FC<BasePropertyProps> = (props) => {
  const { property } = props

  console.log(property)

  return (
    <Container>
      <Title>Plan Settings</Title>
      <FormGroup>
        <FormLabel></FormLabel>
      </FormGroup>
    </Container>
  )
}

export default PlanSettings
