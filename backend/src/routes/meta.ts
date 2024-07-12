import express from 'express';

const metaRouter = express.Router();

metaRouter.get('/', async (_req, res) => {
  res.json({
    framework: process.env.FRAMEWORK,
    version: process.env.APP_VERSION,
    stack: process.env.TECH_STACK,
    cloud_dependencies: process.env.CLOUD_DEPENDENCIES
  });
});

export default metaRouter;
