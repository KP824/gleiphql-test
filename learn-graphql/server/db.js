// 'pg' package is using CommonJS syntax for exports
import pkg from 'pg';
// using default exports to import the 'Client' class
const { Client } = pkg;

// Connection to database with star wars info
const client = new Client({
  user: 'zkyqzpyj',
  host: 'mahmud.db.elephantsql.com',
  database: 'zkyqzpyj',
  password: 'tUf6f5BsfX542DzJaMTuNxcWqgo5orWE',
  port: 5432, // Default PostgreSQL port
});

client.connect();

export default client;