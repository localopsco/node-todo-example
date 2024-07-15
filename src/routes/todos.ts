import express from 'express';
import multer from 'multer';
import { S3Client, DeleteObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'node:fs';
import path from 'node:path';

import prisma from '../db';

const todosRouter = express.Router();
const upload = multer({ dest: 'uploads/' });

const s3config: S3ClientConfig = {
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
};
const bucketName = process.env.S3_BUCKET_NAME;

if (process.env.NODE_ENV === 'development') {
  s3config.endpoint = process.env.MINO_ENDPOINT;
  s3config.forcePathStyle = true; // Required for Minio
}

const s3Client = new S3Client(s3config);

const uploadFile = async (filePath: string, key: string): Promise<string | undefined> => {
  try {
    const fileStream = fs.createReadStream(filePath);
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: fileStream,
    };

    const upload = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    const result = await upload.done();
    console.log(`File uploaded successfully. ${key}`);
    return result.Location;
  } catch (err) {
    console.error('Error uploading file:', err);
  }
};

const deleteFile = async (key: string): Promise<undefined> => {
  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(deleteCommand);
    console.log(`File deleted successfully. ${key}`);
  } catch (err) {
    console.error('Error deleteing file:', err);
  }
};

todosRouter.get('/', async (_req, res) => {
  const todos = await prisma.todo.findMany({
    orderBy: {
      created_at: 'asc',
    },
  });
  res.json(todos);
});

todosRouter.post('/', async (req, res) => {
  const todo = await prisma.todo.create({
    data: {
      title: req.body.title,
      description: req.body.description,
      is_completed: false,
    },
  });

  res.status(201).json(todo);
});

todosRouter.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);

  const todo = await prisma.todo.update({
    where: { id },
    data: {
      title: req.body.title,
      description: req.body.description,
      is_completed: req.body.completed,
    },
  });

  res.json(todo);
});

todosRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  const todo = await prisma.todo.findUnique({
    where: {
      id,
    },
  });

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  await prisma.todo.delete({
    where: { id },
  });

  res.json({ success: 'true' });
});

todosRouter.post('/:id/attach', upload.single('file'), async (req, res) => {
  const id = Number(req.params.id);

  const filePath = req.file?.path;
  const key = req.file?.originalname;

  if (typeof filePath === 'undefined' || typeof key === 'undefined') {
    return res.status(500).send('Error uploading file.');
  }

  try {
    const fileLocation = await uploadFile(filePath, key);
    const todo = await prisma.todo.update({
      where: { id },
      data: {
        attachment_url: decodeURI((fileLocation as string).replace('host.docker.internal', 'localhost:9000')),
      },
    });

    res.json(todo);
  } catch (err) {
    res.status(500).send('Error uploading file.');
  }
});

todosRouter.delete('/:id/attach', async (req, res) => {
  const id = Number(req.params.id);

  const todo = await prisma.todo.findUnique({
    where: { id },
  });

  if (!todo) {
    return res.status(404).send('Todo not found');
  }

  if (!todo.attachment_url) {
    return res.status(422).send('Todo does not have an attachment');
  }

  const key = path.basename(todo.attachment_url);

  try {
    await deleteFile(key);
    const todo = await prisma.todo.update({
      where: { id },
      data: {
        attachment_url: null,
      },
    });

    res.json(todo);
  } catch (err) {
    res.status(500).send('Error uploading file.');
  }
});

export default todosRouter;
