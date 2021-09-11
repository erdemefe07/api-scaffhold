import { AuthenticationRequired, AuthenticationNotCompleted } from '@exceptions';
import { User } from '@models';
import express from 'express';

function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = req.user as User;

  if (!user) {
    throw AuthenticationRequired;
  }

  next();
}

function isUserNamed(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = req.user as User;

  if (!user.displayName) {
    throw AuthenticationNotCompleted;
  }

  next();
}

function disallowNamed(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = req.user as User;

  if (user.displayName) {
    return res.end();
  }

  next();
}

const checkUser = [isAuthenticated, isUserNamed];

export { isAuthenticated, isUserNamed, checkUser, disallowNamed };
