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

app.get('/', async function (req, res) {
  const a = await req.dbConnection.getRepository(A).find()
  return res.status(200).json(a);
})

app.get('/filtered', async function (req, res) {
  const queryBuilder = req.dbConnection.getRepository(A).createQueryBuilder('a')
  queryBuilder.leftJoinAndSelect('a.bs', 'b', '"b"."key" = \'1\'');

  const r = await queryBuilder.getMany();
  return res.status(200).json(r);
})

app.get('/ordered', async function (req, res) {
  const queryBuilder = req.dbConnection.getRepository(A).createQueryBuilder('a')
  queryBuilder.leftJoinAndSelect('a.bs', 'b');
  queryBuilder.addSelect(
    `CASE
      WHEN "b"."key" = '1' THEN 0
      ELSE NULL
    END`,
    'order_key'
  );
  queryBuilder.orderBy('order_key');

  const r = await queryBuilder.getMany();
  return res.status(200).json(r);
})

app.get('/paginated-offset-limit', async function (req, res) {
  const page = req.query['page'] ? Number(req.query['page']) : 1
  const item = req.query['item'] ? Number(req.query['item']) : 5
  const queryBuilder = req.dbConnection.getRepository(A).createQueryBuilder('a')
  queryBuilder.leftJoinAndSelect('a.bs', 'b');

  queryBuilder.offset((page - 1) * item);
  queryBuilder.limit(item);

  const r = await queryBuilder.getMany();
  return res.status(200).json(r);
})

app.get('/paginated-skip-take', async function (req, res) {
  const page = req.query['page'] ? Number(req.query['page']) : 1
  const item = req.query['item'] ? Number(req.query['item']) : 5
  const queryBuilder = req.dbConnection.getRepository(A).createQueryBuilder('a')
  queryBuilder.leftJoinAndSelect('a.bs', 'b');

  queryBuilder.skip((page - 1) * item);
  queryBuilder.take(item);

  const r = await queryBuilder.getMany();
  return res.status(200).json(r);
})


app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`)
})