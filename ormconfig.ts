import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' })

export default {
   type: "postgres",
   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
   username: process.env.DB_USERNAME,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_DBNAME,
   synchronize: true,
   logging: false,
   ssl: {
      rejectUnauthorized: false,
   },
   entities: [
      "src/entity/**/*.ts"
   ],
   migrations: [
      "src/migration/**/*.ts"
   ],
   subscribers: [
      "src/subscriber/**/*.ts"
   ],
}