import { validateSync } from '@middlewares';
import { Router } from 'express';
import { body } from 'express-validator';
import passport from 'passport';

const router = Router();

router.get('/discord', passport.authenticate('discord'));
router.get('/google', passport.authenticate('google'));
router.post(
  '/local',
  validateSync(body('email').isEmail(), body('password').isLength({ min: 8, max: 100 })),
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: process.env.LOCAL_CLIENT_FAILURE_REDIRECT,
  })
);

router.get(
  '/redirect/discord',
  passport.authenticate('discord', {
    successRedirect: '/profile',
    failureRedirect: process.env.DISCORD_CLIENT_FAILURE_REDIRECT,
  })
);

router.get(
  '/redirect/google',
  passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: process.env.GOOGLE_CLIENT_FAILURE_REDIRECT,
  })
);

export default router;
