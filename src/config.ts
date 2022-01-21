import { Connection, createConnection } from "typeorm";
import A from "./entity/A";
import B from "./entity/B";

export function initDatabase(): Promise<Connection | void> {
  return createConnection({
    type: "postgres",
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    entities: [
      A,
      B
    ],
    synchronize: true,
    logging: false,
    ssl: {
      rejectUnauthorized: false,
    },
  })
    .then(connection => connection)
    .catch(error => console.log(error))
};