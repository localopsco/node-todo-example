import express from 'express';
import bodyParser from 'body-parser';

import todosRouter from './routes/todos';
import metaRouter from './routes/meta';

const app = express();
const port = 3001;

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

const apiRouter = express.Router();
apiRouter.use('/meta', metaRouter);
apiRouter.use('/tasks', todosRouter);

app.use('/api/v1', apiRouter);

app.listen(port, () => {
  console.log(`Todo app listening on http://localhost:${port}`);
});
