require('dotenv').config();

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: '0.0.0.0',
      port: 5432,
      database: 'blabbr',
      user: 'root',
      password: 'root',
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },

  production: {
    client: 'postgresql',
    connection: process.env.DB_CONNECTION_STRING,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
};
