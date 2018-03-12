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

// client side 暂存 store，GraphQL Server reponse 会更新 store，再透过 props 传递给 Component
const STORE = {
  teas: [
    { name: 'Bancha', steepingTime: 2 },
    { name: 'Sencha Makoto', steepingTime: 2 },
    { name: 'Milk Oolong', steepingTime: 3 },
    { name: 'Jasmine Phoenix Pearls', steepingTime: 3 },
    { name: 'Gunpowder Golden Temple', steepingTime: 3 },
    { name: 'Pu Erh First Grade', steepingTime: 4 },
    { name: 'Kenya Milima', steepingTime: 5 },
    { name: 'Assam Hatimara', steepingTime: 5 },
    { name: 'Golden Tip Yunnan', steepingTime: 5 },
    { name: 'Earl Grey Blue Star', steepingTime: 5 },
    { name: 'Ceylon New Vithanakande', steepingTime: 5 },
  ],
};

// 设计 GraphQL Type
var teaType = new GraphQLObjectType({
  name: 'Tea',
  fields: () => ({
    name: { type: GraphQLString },
    steepingTime: { type: GraphQLInt },
  }),
});

// 将 Tea 整合进来
var storeType = new GraphQLObjectType({
  name: 'Store',
  fields: () => ({
    teas: { type: new GraphQLList(teaType) },
  }),
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    store: {
      type: storeType,
      resolve: () => STORE,
    },
  })
})

var { connectionType : teaConnection } =  connectionDefinitions({
  name: 'Tea', nodeType: teaType
})

// 输出 GraphQL Schema
export var Schema = new GraphQLSchema({
  query: queryType
});
