// 引入函式库
import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';


import {
  createTea,
  getContries,
  getContry,
  getContryByName,
  getTeas,
  getTea,
} from './database'


// ================================  ================================
// == node definition
// ================================  ================================

const { nodeInterface, nodeField } = nodeDefinitions((globalId) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'Contry') {
      const contry = getContry(id)
      console.info(`schema.js getContry = ${contry}`)
      return contry;
    } else if (type === 'Tea') {
      const tea = getTea(id)
      console.info(`schema.js getTea = ${tea}`)
      return tea;
    } else {
      return null;
    }
  }, (obj) => {
    return obj.teas ? ContryType : TeaType;
  }
);


// ================================  ================================
// == Type
// ================================  ================================


var ContryType = new GraphQLObjectType({
  name: 'Contry',
  description: '国家',
  fields: () => ({
    id: globalIdField('Contry'),
    name: {
      type: GraphQLString,
      description: '国家名称'
    },
    teas: {
      description: '属于这个国家的著名茶叶',
      args: connectionArgs,
      type: teaConnection,
      resolve: (contry, args) => connectionFromArray(contry.teaIds.map(id => getTea(id)), args)
    },
  }),
  interfaces: [nodeInterface],
});

var TeaType = new GraphQLObjectType({
  name: 'Tea',
  fields: () => ({
    id: globalIdField('Tea'),
    name: { type: GraphQLString },
  }),
  interfaces: [nodeInterface],
});


// ================================  ================================
// == Mutation
// ================================  ================================


// ================================  ================================
// == Connection
// ================================  ================================

// var {
//   connectionType : teaConnection
// } =  connectionDefinitions({ name: 'Tea', nodeType: TeaType });


/**
 * We define a connection between a faction and its ships.
 *
 * connectionType implements the following type system shorthand:
 *   type ShipConnection {
 *     edges: [ShipEdge]
 *     pageInfo: PageInfo!
 *   }
 *
 * connectionType has an edges field - a list of edgeTypes that implement the
 * following type system shorthand:
 *   type ShipEdge {
 *     cursor: String!
 *     node: Ship
 *   }
 */
const {
  connectionType: teaConnection,
  edgeType: teaEdge,
} = connectionDefinitions({ name: 'Tea', nodeType: TeaType });


// ================================  ================================
// == Query
// ================================  ================================

var QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    contry: {
      type: ContryType,
      args: {
        name: {
          type: GraphQLString
        }
      },
      resolve: (root, { name }) => getContryByName(name)
    },
  }),
})


// 输出 GraphQL Schema
export var Schema = new GraphQLSchema({
  query: QueryType
});





























