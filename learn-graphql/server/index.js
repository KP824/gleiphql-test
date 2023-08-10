// testing npm package install

import { startStandaloneServer }  from '@apollo/server/standalone';

import pkg from 'graphql';
const { printSchema, gql } = pkg;

//const { graphqlHTTP } = require('express-graphql');
// import { printSchema } from 'graphql';
import { ApolloServer } from '@apollo/server';
//import { gql } from '@apollo/client';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import json from 'body-parser';
// import schema from './schema/starWarsSchema.js';
// import {
//   fetchFilmById,
//   fetchPersonById,
//   fetchPlanetById,
//   fetchSpeciesById,
//   fetchStarshipById,
//   fetchVehicleById,
// } from './schema/starWarsResolvers.js';


// Configuration for the expressEndpointMonitor middleware.

const apolloConfig = {
  complexityLimit: 3000,
  paginationLimit: 10,
  monitor: true,
  refillTime: 300000,   // 5 minutes
  refillAmount: 1000,
  redis: false
}


const app = express();
const httpServer = http.createServer(app);

// console.log('schema:', printSchema(schema)); // Logging for debugging
// console.log('resolvers:', resolvers); // Logging for debugging

const typeDefs = `
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.

  directive @cost(value: Int) on FIELD_DEFINITION

  type Book {
    title: String @cost(value:50)
    author: String @cost(value: 1000)
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book] @cost(value: 333)
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const resolvers = {
  Query: {
    books: () => books,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
  ],
})

// const server = new ApolloServer({
//   schema,
//   resolvers: {
//     Query: {
//       film: fetchFilmById,
//       people: fetchPersonById,
//       planet: fetchPlanetById,
//       species: fetchSpeciesById,
//       starship: fetchStarshipById,
//       vehicle: fetchVehicleById,
//     },
//   },
//   plugins: [
//     ApolloServerPluginDrainHttpServer({ httpServer }),
//     apolloRateLimiter(apolloConfig),
//     apolloEndpointMonitor(monitorConfig)
//   ],
// });

server.start().then(() => {
  app.use(
    '/graphql',
    cors(),
    json(),
    expressMiddleware(server, {
      context: 
        async ({ req }) => ({ token: req.headers.token }),
    }),
  );

  httpServer.listen({ port: 4000 }, () => {
    console.log(`🚀 Server is LIVE at http://localhost:4000/graphql`);
  });
});

