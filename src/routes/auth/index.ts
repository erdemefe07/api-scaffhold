import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import * as nodemailer from 'nodemailer';
import { nanoid } from 'nanoid';
import getClient from '@redis';
import { Redis } from 'ioredis';
import ms from 'ms';
import { User } from '@models';
import loginsRouter from './login';

const router = Router();
const redis = getClient as Redis;

router.get(
  '/resetPassword/:email',
  asyncHandler(async (req, res) => {
    const { email } = req.params;

    let testAccount = {
      user: '',
      pass: '',
    };

    if (process.env.NODE_ENV === 'development') {
      testAccount = await nodemailer.createTestAccount();
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_TRANSPORT_HOST,
      port: Number(process.env.MAIL_TRANSPORT_PORT),
      secure: !!process.env.MAIL_TRANSPORT_SECURE,
      auth: {
        user: process.env.MAIL_TRANSPORT_USER || testAccount.user,
        pass: process.env.MAIL_TRANSPORT_PASS || testAccount.pass,
      },
    });

    const id = nanoid();

    await redis.setex(id, ms('30min') / 1000, email);

    const info = await transporter.sendMail({
      from: '"Virtueer" <security@virtueer.com>',
      to: email,
      subject: 'Şifre Sıfırlama İsteği',
      html: `Merhabalar

Virtueer şifrenizi yenileme talebinde bulundunuz.
Şifrenizi aşağıdaki linke tıklayarak güncelleyebilirsiniz.
Eğer şifre yenileme talebinde bulunmadıysanız lütfen bu maili dikkate almayınız.

<a href="https://api.virtueer.com/auth/resetPassword/${email}/${id}">Şifremi sıfırla</a>

Eğer düzgün görüntüleyemiyorsanız:

https://api.virtueer.com/auth/resetPassword/${email}/${id}
`,
    });

    console.log(nodemailer.getTestMessageUrl(info)); // TODO remove
    res.json({ success: true });
  })
);

router.post(
  '/resetPassword/:email/:id',
  asyncHandler(async (req, res) => {
    const { email, id } = req.params;
    const { newPassword, newPasswordAgain } = req.body;
    if (newPassword !== newPasswordAgain) {
      return res.json({ error: true, message: 'Passwords not equal' });
    }

    const _email = await redis.get(id);
    if (email !== _email) {
      return res.json({ error: true, message: 'Not Found' });
    }
    const [ok] = await User.update(
      {
        password: newPassword,
      },
      {
        where: { email },
        individualHooks: true,
      }
    );

    if (ok !== 1) {
      return res.json({ success: false });
    }

    redis.del(id);

    res.json({
      success: true,
    });
  })
);

router.use(loginsRouter);

export default router;
