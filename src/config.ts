import { Connection, createConnection } from "typeorm";
import A from "./entity/A";
import B from "./entity/B";

export default class Config {
  private _dbConnection: Connection = undefined;
  
  constructor() {
    this.initDatabase();
  }

  get dbConnection(): Connection | undefined {
    return this._dbConnection;
  }

  initDatabase(): void {
    createConnection({
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
      .then(connection => {
        this._dbConnection = connection
        console.log("connection with db established");
      })
      .catch(error => console.log(error))
  };
}