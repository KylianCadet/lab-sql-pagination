import "reflect-metadata";
import * as dotenv from 'dotenv';
import { initDatabase } from './config';
import { Connection } from "typeorm";

dotenv.config({ path: '.env' })

function app(connection: Connection) {
  console.log(connection);
}

initDatabase().then((connection: void | Connection) => {
  if (!connection) return;
  app(connection);
});