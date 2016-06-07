/* @flow weak */

import {GraphQLID, GraphQLNonNull, GraphQLObjectType} from "graphql";

import _mutations from "../../configuration/graphql/_mutations";
import NodeInterface from "../NodeInterface";

export default new GraphQLObjectType( {
  name: 'Mutation',
  fields: () => ({
    node: {
      type: NodeInterface,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve: () => {}
    },
  })
} );
