import { PageInfo } from '../../object-types'
import { ClassType, ObjectType, Field } from 'type-graphql'
import * as Relay from 'graphql-relay'

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
