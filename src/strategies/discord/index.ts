import { User } from '@models';
import { Strategy as DiscordStrategy } from 'passport-discord';

const discordStrategy = new DiscordStrategy(
  {
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CLIENT_REDIRECT,
    scope: ['identify', 'email'],
  },
  async (accessToken, refreshToken, profile, done) => {
    const [user] = await User.findOrCreate({
      where: { email: profile.email },
      defaults: {
        avatar: null,
        email: profile.email,
        password: null,
        displayName: null,
      },
    });

    done(null, user);
  }
);
export default discordStrategy;
