import express from 'express';
import bodyParser from 'body-parser';

import todosRouter from './routes/todos';
import metaRouter from './routes/meta';

const app = express();
const port = process.env.PORT ?? 3001;

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

// health endpoints
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
apiRouter.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

app.listen(port, () => {
  console.log(`Todo app listening on http://localhost:${port}`);
});
