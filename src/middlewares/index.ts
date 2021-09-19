import { AuthenticationRequired, AuthenticationNotCompleted, EmailVerifyRequired } from '@exceptions';
import { User } from '@models';
import express from 'express';
import { ValidationChain, validationResult } from 'express-validator';

function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = req.user as User;

  if (!user) {
    throw AuthenticationRequired;
  }

  next();
}

function isEmailVerified(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = req.user as User;

  if (!user.verified) {
    throw EmailVerifyRequired;
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
    return res.json({ success: false });
  }

  next();
}

const checkUser = [isAuthenticated, isUserNamed, isEmailVerified];

// eslint-disable-next-line arrow-body-style
const validate = (...validations: ValidationChain[]) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

// eslint-disable-next-line arrow-body-style
const validateSync = (...validations: ValidationChain[]) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    for (const validation of validations) {
      // eslint-disable-next-line no-await-in-loop
      const result = await validation.run(req);
      // @ts-ignore
      if (result.errors.length) {
        break;
      }
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

export { isAuthenticated, isUserNamed, checkUser, disallowNamed, isEmailVerified, validate, validateSync };
