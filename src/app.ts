import * as App from "express";
import * as dotenv from "dotenv";
import Config from "./config";
import A from './entity/A'

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
  queryBuilder.addOrderBy(
    `CASE
      WHEN "b"."key" = '1' THEN 0
      ELSE NULL
    END
  `, 'ASC');

  const r = await queryBuilder.getMany();
  return res.status(200).json(r);
})

app.get('/paginated-ordered-custom-join', async function (req, res) {
  const page = req.query['page'] ? Number(req.query['page']) : 1
  const item = req.query['item'] ? Number(req.query['item']) : 5

  const queryBuilder = req.dbConnection.getRepository(A).createQueryBuilder('a');
  queryBuilder.leftJoinAndSelect('a.bs', 'b-filtered', "b-filtered.key = '1'");
  queryBuilder.leftJoinAndSelect('a.bs', 'b');

  queryBuilder.addOrderBy('b-filtered.value');
  queryBuilder.addOrderBy('a.id');

  queryBuilder.skip((page - 1) * item);
  queryBuilder.take(item);

  const r = await queryBuilder.getMany();
  return res.status(200).json(r);
})

app.get('/paginated-ordered-workaround', async function (req, res) {
  const page = req.query['page'] ? Number(req.query['page']) : 1
  const item = req.query['item'] ? Number(req.query['item']) : 5

  const queryBuilder = req.dbConnection.getRepository(A).createQueryBuilder('a')
  queryBuilder.leftJoinAndSelect('a.bs', 'b');

  /**
   * Sub-queries to order the elements
   * @returns Arrays of ids ordered
   */
  const getOrderedIds = async (): Promise<number[]> => {
    const queryBuilder = req.dbConnection.getRepository(A).createQueryBuilder('a')
    queryBuilder.leftJoinAndSelect('a.bs', 'b');
    queryBuilder.addOrderBy(
      `CASE
        WHEN "b"."key" = '1' THEN 0
        ELSE NULL
      END
    `, 'ASC');
    const r = await queryBuilder.getMany();
    return r.map((v) => v.id);
  }

  const orderedIds = await getOrderedIds();
  queryBuilder.addSelect(
    `CASE
      ${orderedIds.map((id, index) => `WHEN "a"."id" = ${id} THEN ${index}`).join('\n')}
      ELSE NULL
    END`, 'orderby_key');
  queryBuilder.addOrderBy('orderby_key');


  queryBuilder.skip((page - 1) * item);
  queryBuilder.take(item);

  console.log(queryBuilder.getSql());
  const r = await queryBuilder.getMany();
  return res.status(200).json(r);
})

app.get('/paginated-ordered-test', async function (req, res) {
  const page = req.query['page'] ? Number(req.query['page']) : 1
  const item = req.query['item'] ? Number(req.query['item']) : 5

  const queryBuilder = req.dbConnection.getRepository(A).createQueryBuilder('a')
  queryBuilder.leftJoinAndSelect('a.bs', 'b');

  queryBuilder.addSelect(
    `CASE
      WHEN "b"."key" = '1' THEN 0
      ELSE NULL
    END
  `, 'ordered_key');

  queryBuilder.orderBy('ordered_key');

  queryBuilder.skip((page - 1) * item);
  queryBuilder.take(item);

  const r = await queryBuilder.getMany();
  return res.status(200).json(r);
})

app.get('/paginated-ordered', async function (req, res) {
  const page = req.query['page'] ? Number(req.query['page']) : 1
  const item = req.query['item'] ? Number(req.query['item']) : 5

  const queryBuilder = req.dbConnection.getRepository(A).createQueryBuilder('a')
  queryBuilder.leftJoinAndSelect('a.bs', 'b');
  queryBuilder.addOrderBy(
    `CASE
      WHEN "b"."key" = '1' THEN 0
      ELSE NULL
    END
  `, 'ASC');

  queryBuilder.skip((page - 1) * item);
  queryBuilder.take(item);

  /**
   * Impossible de getMany en utilisant orderBy + skip / take
   * Possible d'utiliser getMany avec offset / limit
   */
  // const r = await queryBuilder.getMany();
  const r = await queryBuilder.getRawMany();
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


// conditional OrderBy + skip / take -> doesn't work
// conditional OrderBy + offset / limit -> works
// conditional addSelect + orderBy + skip / take -> undefined
// multiple joined column with orderBy -> works