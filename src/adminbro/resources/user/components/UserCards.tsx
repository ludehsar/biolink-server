import React from 'react'
import { RecordJSON } from 'admin-bro'
import { CardGridContainer } from '../../../shared/components/Common.styled'
import Card from '../../../shared/components/DashboardCard'

const UserCards: React.FC<RecordJSON> = ({ params, id }) => {
  return (
    <CardGridContainer>
      <Card
        title="Biolinks"
        icon="Roadmap"
        value={params.biolinkCount}
        href={'/admin/resources/Biolink?filters.userId=' + id + '&page=1'}
      />
      <Card
        title="Links"
        icon="Link"
        value={params.linkCount}
        href={'/admin/resources/Link?filters.userId=' + id + '&page=1'}
      />
      <Card
        title="Custom Domains"
        icon="Wikis"
        value={params.domainCount}
        href={'/admin/resources/Domain?filters.userId=' + id + '&page=1'}
      />
      <Card title="Payments" icon="Filter" value={params.paymentCount} href="#" />
    </CardGridContainer>
  )
}

export default UserCards
