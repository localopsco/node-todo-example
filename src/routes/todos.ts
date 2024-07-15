import express from 'express';
import multer from 'multer';
import path from 'node:path';

import prisma from '../db';
import * as s3 from '../lib/s3';

const todosRouter = express.Router();
const upload = multer({ dest: 'uploads/' });

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
    const fileLocation = await s3.uploadFile(filePath, key);
    if (!fileLocation) {
      await s3.deleteFile(key);
      return res.status(422).json({ message: 'Failed to upload file' });
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        attachment_url: decodeURI(fileLocation.replace('host.docker.internal', 'localhost:9000')),
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
    return res.status(422).send('Todo does not have an attachment to delete');
  }

  const key = path.basename(todo.attachment_url);

  try {
    await s3.deleteFile(key);
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
