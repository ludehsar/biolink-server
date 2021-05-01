import React from 'react'

import { CardGridContainer } from '../../shared/components/Common.styled'
import Card from '../../shared/components/DashboardCard'
import { Container } from './dashboard.styled'

const Dashboard: React.FC = () => {
  return (
    <Container>
      <CardGridContainer>
        <Card title="Biolink Pages" icon="Hashtag" value={0} href="Something" />
        <Card title="Links" icon="Link" value={0} href="Something" />
        <Card title="Pageviews Tracked" icon="Analytics" value={0} href="Something" />
        <Card title="Domains" icon="Wikis" value={0} href="Something" />
        <Card title="Users" icon="UserMultiple" value={0} href="Something" />
        <Card title="Codes" icon="Scan" value={0} href="Something" />
        <Card title="Paymnets" icon="Filter" value={0} href="Something" />
        <Card title="Earned" icon="Wallet" value={0} href="Something" />
      </CardGridContainer>
    </Container>
  )
}

export default Dashboard
