import React from 'react'

import { CardBox, CardBody } from './Common.styled'
import { CardIcon, CardTitle, CardDetails, CardValue, CardSeeMore } from './DashboardCard.styled'

export interface CardProps {
  title: string
  icon: string
  value: string | number
  href?: string
}

const Card: React.FC<CardProps> = (props) => {
  const { title, icon, value, href } = props
  return (
    <CardBox>
      <CardBody>
        <CardTitle as="small">
          <CardIcon size={16} icon={icon} /> {title}
        </CardTitle>
        <CardDetails>
          <CardValue>{value}</CardValue>
        </CardDetails>
      </CardBody>
      {href && (
        <CardSeeMore>
          <CardIcon size={20} icon="ArrowRight" color="white" />
        </CardSeeMore>
      )}
    </CardBox>
  )
}

export default Card
