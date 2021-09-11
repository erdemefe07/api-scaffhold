import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CLIENT_REDIRECT,
    scope: ['email', 'profile'],
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log(profile);
    console.log(accessToken);
    console.log(refreshToken);
    cb(null, profile);
  }
);

export default googleStrategy;
