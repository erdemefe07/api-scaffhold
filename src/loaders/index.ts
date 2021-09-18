import { User } from '@models';
import redis from '@redis';
import connectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import { Redis } from 'ioredis';
import ms from 'ms';
import passport from 'passport';

const RedisStore = connectRedis(session);
const configured = {
  session: session({
    name: 'session',
    store: new RedisStore({ client: redis as Redis }),
    secret: process.env.SESSION_SECRET,
    proxy: true,
    cookie: {
      maxAge: ms(process.env.COOKIE_MAX_AGE),
      secure: true,
    },
    saveUninitialized: false,
    resave: false,
  }),
  helmet: helmet({
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: true,
    originAgentCluster: true,
  }),
  cors: cors({
    credentials: true,
    origin(origin, cb) {
      if (process.env.NODE_ENV === 'development') {
        return cb(null, true);
      }

      const origins = JSON.parse(process.env.CORS_ORIGINS);
      if (origins.indexOf(origin) !== -1) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'));
      }
    },
  }),
};

passport.serializeUser((user: User, done) => {
  DeletePassword(user, done);
});

passport.deserializeUser((user: User, done) => {
  DeletePassword(user, done);
});

// eslint-disable-next-line no-unused-vars
function DeletePassword(user: User, done: (err: any, newUser?: User | false | null) => void) {
  let _user = user;

  if (user.constructor.name === 'User') {
    _user = user.toJSON() as User;
  }

  delete _user.password;
  done(null, _user);
}

export { redis, express, passport, cookieParser, configured };
