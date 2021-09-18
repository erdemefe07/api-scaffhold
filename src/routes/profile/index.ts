import { isAuthenticated, checkUser, disallowNamed } from '@middlewares';
import { Router } from 'express';
import multer from 'multer';
import { compare } from 'bcrypt';
import asyncHandler from 'express-async-handler';
import { User } from '@models';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.get(
  '/',
  checkUser,
  asyncHandler(async (req, res) => {
    res.json({
      cookies: req.cookies,
      user: req.user,
      session: req.session,
      id: req.sessionID,
      sid: req.session.id,
      isAuthenticated: req.isAuthenticated(),
      isUnauthenticated: req.isUnauthenticated(),
      info: req.authInfo,
    });
  })
);

router.post(
  '/complete',
  isAuthenticated,
  disallowNamed,
  upload.single('avatar'),
  asyncHandler(async (req, res) => {
    const { displayName } = req.body;
    const avatar = req.file.filename;
    const user = req.user as User;
    const result = await User.update({ displayName, avatar }, { where: { email: user.email }, returning: true });
    const lastUser = result[1][0];
    req.login(lastUser, err => {
      if (err) {
        throw err;
      }

      res.json({ success: true });
    });
  })
);

router.post(
  '/changePassword',
  checkUser,
  asyncHandler(async (req, res) => {
    const _user = req.user as User;
    const { oldPassword, newPassword, newPasswordAgain } = req.body;
    if (newPassword !== newPasswordAgain) {
      return res.status(400).json({ error: true, message: 'Passwords not equal' });
    }

    const user = await User.findOne({ where: { email: _user.email }, attributes: { include: ['password'] } });
    const isEqual = await compare(oldPassword, user.password || '');

    if (!isEqual) {
      return res.status(400).json({ error: true, message: 'Password wrong' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ success: true });
  })
);

router.post(
  '/logout',
  isAuthenticated,
  asyncHandler(async (req, res) => {
    req.logout();
    res.clearCookie('session');
    req.session.destroy(() => res.json({ success: true }));
  })
);

export default router;
