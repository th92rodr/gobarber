import 'reflect-metadata';
import 'dotenv/config';

import 'express-async-errors';
import { errors } from 'celebrate';
import express, { Request, Response, NextFunction } from 'express';

import '@shared/container';
import '@shared/infra/typeorm';

import routes from './routes';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errors());

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    console.error(error);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error.',
    });
  },
);

app.listen(3333, () => {
  console.log('Server running on port 3333...');
});
