import * as Relay from 'graphql-relay'
import { Field, ObjectType, ClassType, InputType } from 'type-graphql'

@InputType()
export class ConnectionArgs implements Relay.ConnectionArguments {
  @Field(() => String, {
    nullable: true,
    description: 'Paginate before created at timestamp as opaque cursor',
  })
  before?: Relay.ConnectionCursor

  @Field(() => String, {
    nullable: true,
    description: 'Paginate after created at timestamp as opaque cursor',
  })
  after?: Relay.ConnectionCursor

  @Field(() => String, { defaultValue: '', description: 'Search query' })
  query!: string

  @Field(() => Number, { defaultValue: 10, description: 'Paginate first' })
  first?: number
}

@ObjectType()
export class PageInfo implements Relay.PageInfo {
  @Field(() => Boolean)
  hasNextPage?: boolean

  @Field(() => Boolean)
  hasPreviousPage?: boolean

  @Field(() => String, { nullable: true })
  startCursor?: Relay.ConnectionCursor

  @Field(() => String, { nullable: true })
  endCursor?: Relay.ConnectionCursor
}

export function EdgeType<NodeType>(nodeName: string, nodeType: ClassType<NodeType>) {
  @ObjectType(`${nodeName}Edge`, { isAbstract: true })
  abstract class Edge implements Relay.Edge<NodeType> {
    @Field(() => nodeType)
    node!: NodeType

    @Field(() => String, { description: 'Used in `before` and `after` args' })
    cursor!: Relay.ConnectionCursor
  }

  return Edge
}

type ExtractNodeType<EdgeType> = EdgeType extends Relay.Edge<infer NodeType> ? NodeType : never

export function ConnectionType<
  EdgeType extends Relay.Edge<NodeType>,
  NodeType = ExtractNodeType<EdgeType>
>(nodeName: string, edgeClass: ClassType<EdgeType>) {
  @ObjectType(`${nodeName}Connection`, { isAbstract: true })
  abstract class Connection implements Relay.Connection<NodeType> {
    @Field(() => PageInfo)
    pageInfo!: PageInfo

    @Field(() => [edgeClass])
    edges!: EdgeType[]
  }

  return Connection
}
