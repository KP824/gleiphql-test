// import client from '../db.js';
// import { GraphQLInt } from 'graphql';

// export const fetchFilmById = async (_, args) => {
//   try {
//     const query = 'SELECT * FROM planets WHERE id = $1';
//     const values = [args.id];
//     const response = await client.query(query, values);
//     return response.rows[0];
//   } catch(error) {
//     //console.error(error);
//     throw new Error(`Error from RootQuery, failed to fetch planets`);
//   }
// };

// export const fetchPersonById = async (_, args) => {
//   try {
//     const query = 'SELECT * FROM people WHERE id = $1';
//     const values = [args.id];
//     const response = await client.query(query, values);
//     return response.rows[0];
//   } catch (error) {
//     //console.error(error);
//     throw new Error(`Error from RootQuery, failed to fetch person`);
//   }
// }; 

// export const fetchPlanetById = async (_, args) => {
//   try {
//     const query = 'SELECT * FROM planets WHERE id = $1';
//     const values = [args.id];
//     const response = await client.query(query, values);
//     return response.rows[0];
//   } catch(error) {
//     //console.error(error);
//     throw new Error(`Error from RootQuery, failed to fetch planets`);
//   }
// };

// export const fetchSpeciesById = async (_, args) => {
//   try {
//     const query = 'SELECT * FROM species WHERE id = $1';
//     const values = [args.id];
//     const response = await client.query(query, values);
//     return response.rows[0];
//   } catch (error) {
//     //console.error(error);
//     throw new Error(`Error from RootQuery, failed to fetch species`);
//   }
// };

// export const fetchStarshipById = async (_, args) => {
//   try {
//     const query = 'SELECT * FROM starships WHERE id = $1';
//     const values = [args.id];
//     const response = await client.query(query, values);
//     return response.rows[0];
//   } catch(error) {
//     //console.error(error);
//     throw new Error(`Error from RootQuery, failed to fetch starship`);
//   }
// };

// export const fetchVehicleById = async (_, args) => {
//   try {
//     const query = 'SELECT * FROM vehicles WHERE id = $1';
//     const values = [args.id];
//     const response = await client.query(query, values);
//     return response.rows[0];
//   } catch(error) {
//     //console.error(error);
//     throw new Error(`Error from RootQuery, failed to fetch vehicle`);
//   }
// };



// // export default {
// //   Query: {
// //     film: fetchFilmById,
// //     people: fetchPersonById,
// //     planet: fetchPlanetById,
// //     species: fetchSpeciesById,
// //     starship: fetchStarshipById,
// //     vehicle: fetchVehicleById,
// //   },
// // }