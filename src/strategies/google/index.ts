import { User } from '@models';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CLIENT_REDIRECT,
    scope: ['email', 'profile'],
  },
  async (accessToken, refreshToken, profile, done) => {
    const [user] = await User.findOrCreate({
      where: { email: profile._json.email },
      defaults: {
        verified: profile._json.email_verified,
        avatar: null,
        email: profile._json.email,
        password: null,
        displayName: null,
      },
    });

    done(null, user);
  }
);

export default googleStrategy;
