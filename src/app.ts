import * as App from "express";
import * as dotenv from "dotenv";
import Config from "./config";
import A from './entity/A'
import B from './entity/B'

dotenv.config({ path: '.env' })
const app = App();
const config = new Config();

app.use(function (req: App.Request, res: App.Response, next: App.NextFunction) {
  req.dbConnection = config.dbConnection;
  next();
})

app.get('/', function (req, res) {
  res.send(req.dbConnection.getRepository(A).find());
})

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`)
})