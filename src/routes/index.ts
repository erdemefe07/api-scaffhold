// const { isAuthenticated } = require('@middlewares');

import express from 'express';
import auth from './auth';
import profile from './profile';

function routes(app: express.Application) {
  app.use('/auth', auth);
  app.use('/profile', profile);
  // app.use('/profile', isAuthenticated, profile);
}

export default routes;
