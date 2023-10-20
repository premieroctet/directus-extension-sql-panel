import knex from 'knex';

export function getKnexInstance() {
  const {
    DB_CLIENT,
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
    DB_PASSWORD,
    DB_SSL,
    DB_USER,
  } = process.env;
  if (
    !DB_CLIENT ||
    !DB_HOST ||
    !DB_PORT ||
    !DB_DATABASE ||
    !DB_PASSWORD ||
    !DB_SSL
  )
    throw new Error('Missing env variables');

  const instance = knex({
    client: DB_CLIENT,
    connection: {
      host: DB_HOST,
      port: parseFloat(DB_PORT as string),
      user: DB_USER,
      database: DB_DATABASE,
      password: DB_PASSWORD,
      ...(DB_SSL === 'true' && { ssl: { rejectUnauthorized: false } }),
    },
    pool: {
      min: 0,
      max: 15,
    },
    log: {
      error(message) {
        console.error(message);
      },
    },
  });

  return instance;
}
