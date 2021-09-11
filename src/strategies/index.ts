import passport from 'passport';
import discordStrategy from './discord';
import googleStrategy from './google';
import localStrategy from './local';

export default function () {
  passport.use(discordStrategy);
  passport.use(googleStrategy);
  passport.use(localStrategy);
}
