import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  parse,
} from 'graphql';
// import connection to database
import client from '../db.js';
// import types for main query
import { 
  FilmType, 
  PeopleType, 
  PlanetType, 
  SpeciesType, 
  StarshipType, 
  VehicleType 
} from './starWarsTypes.js';

import {
  fetchFilmById,
  fetchPersonById,
  fetchPlanetById,
  fetchSpeciesById,
  fetchStarshipById,
  fetchVehicleById,
} from './starWarsResolvers.js';



// Root Query:
const RootQuery = new GraphQLObjectType({
  name: 'Query',
  // https://swapi.dev/documentation#root, Can declare all the foot fields here:
  fields: {
    film: {
      type: FilmType,
      args: { 
        id: { type: GraphQLInt } 
      },
      resolve: fetchFilmById,
    },
    // people (single)
    people: {
      type: PeopleType,
      args: { id: { type: GraphQLInt } },
      resolve: fetchPersonById,
    },
    
    planet: {
      type: PlanetType,
      args: { id: { type: GraphQLInt } },
      resolve: fetchPlanetById,
    },
    
    species: {
      type: SpeciesType,
      args: { id: { type: GraphQLInt } },
      resolve: fetchSpeciesById,
    },
    
    starship: {
      type: StarshipType, 
      args: { id: { type: GraphQLInt } },
      resolve: fetchStarshipById,
    },

    vehicle: {
      type: VehicleType,
      args: { id: { type: GraphQLInt } },
      resolve: fetchVehicleById,
    },
  }
});


export default RootQuery;