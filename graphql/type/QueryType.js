/* @flow weak */

import { fromGlobalId } from "graphql-relay";
import { GraphQLID, GraphQLNonNull, GraphQLObjectType } from "graphql";

import NodeInterface from "../NodeInterface";

function resolveNodeField( source, args, context, { rootValue: objectManager } )
{
  // the node field will receive a globally
  // unique id, and here we convert that back
  // to the local type and id
  const {local_id, type} = fromGlobalId(args.id);

  return objectManager.getOneById( type, local_id );
}

export default new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    node: {
      type: NodeInterface,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve: resolveNodeField
    },
  })
});
