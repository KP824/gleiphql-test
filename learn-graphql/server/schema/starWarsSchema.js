// Schema to explor the star wars api
import { GraphQLSchema } from 'graphql';
import RootQuery from './starWarsQueries.js';
import Mutation from './starWarsMutations.js';


const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

export default schema;



