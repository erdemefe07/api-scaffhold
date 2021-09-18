import { User } from '@models';
import { Strategy as LocalStrategy } from 'passport-local';
import { compare } from 'bcrypt';

const localStrategy = new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  const user = await User.findOne({ where: { email }, attributes: { include: ['password'] } });

  if (!user) {
    const newUser = await User.create(
      {
        email,
        password,
        avatar: null,
        displayName: null,
        verified: false,
      },
      {
        returning: true,
      }
    );

    return done(null, newUser);
  }

  if (!user?.password) {
    return done(null, false);
  }

  const validPassword = await compare(password, user.password);
  if (!validPassword) {
    return done(null, false);
  }

  done(null, user);
});

export default localStrategy;
