import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/', (req, res) => {
  res.send(`
  <ul>
  <li>
  <a href="/auth/discord">Login with Discord</a>
  </li>

  <li>
  <a href="/auth/google">Login with Google</a>
  </li>
  </ul>

  <form method="POST" action="/auth/local">
  <input type="text" placeholder="email" name="email">
  <input type="text" placeholder="password" name="password">

  <input type="submit">
  </form>
  `);
});
router.get('/discord', passport.authenticate('discord'));
router.get('/google', passport.authenticate('google'));
router.post(
  '/local',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/auth',
  })
);

router.get(
  '/redirect/discord',
  passport.authenticate('discord', {
    successRedirect: '/profile',
    failureRedirect: '/auth',
  })
);

router.get(
  '/redirect/google',
  passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/auth',
  })
);

export default router;
