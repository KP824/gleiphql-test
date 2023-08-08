// testing npm package install
import { apolloRateLimiter, apolloEndpointMonitor, gleiphqlContext } from '@larkinaj/test2';
import { startStandaloneServer }  from '@apollo/server/standalone';

//const { graphqlHTTP } = require('express-graphql');
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import json from 'body-parser';
import schema from './schema/starWarsSchema.js';
import {
  fetchFilmById,
  fetchPersonById,
  fetchPlanetById,
  fetchSpeciesById,
  fetchStarshipById,
  fetchVehicleById,
} from './schema/starWarsResolvers.js';


// Configuration for the expressEndpointMonitor middleware.
const monitorConfig = {
  gliephqlUsername: 'andrew@gmail.com',
  gliephqlPassword: 'password',
};

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

// console.log('schema:', schema); // Logging for debugging
// console.log('resolvers:', resolvers); // Logging for debugging

const server = new ApolloServer({
  schema,
  resolvers: {
    Query: {
      film: fetchFilmById,
      people: fetchPersonById,
      planet: fetchPlanetById,
      species: fetchSpeciesById,
      starship: fetchStarshipById,
      vehicle: fetchVehicleById,
    },
  },
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    apolloRateLimiter(apolloConfig),
    apolloEndpointMonitor(monitorConfig)
  ],
});

server.start().then(() => {
  app.use(
    '/graphql',
    cors(),
    json(),
    expressMiddleware(server, {
      context: 
        //async ({ req }) => ({ token: req.headers.token }),
        gleiphqlContext
    }),
  );

  httpServer.listen({ port: 4000 }, () => {
    console.log(`🚀 Server is LIVE at http://localhost:4000/graphql`);
  });
});

