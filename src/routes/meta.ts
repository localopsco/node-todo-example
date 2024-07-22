import express from 'express';
import * as s3 from '../lib/s3';

const metaRouter = express.Router();

metaRouter.get('/', async (_req, res) => {
  res.json({
    framework: 'node',
    version: process.env.APP_VERSION,
    stack: process.env.TECH_STACK,
    cloud_dependencies: s3.isEnabled() ? process.env.CLOUD_DEPENDENCIES : '',
    attachment_supported: s3.isEnabled(),
  });
});

export default metaRouter;
