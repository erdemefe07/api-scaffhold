import { express, cors, passport, cookieParser, configured } from './loaders';

import initStrategies from './strategies';
import initRoutes from './routes';

const app = express();

app.use(configured.helmet);
app.use(
  cors({
    origin(origin, cb) {
      if (process.env.NODE_ENV !== 'development') {
        return cb(null, true);
      }

      const origins = JSON.parse(process.env.CORS_ORIGINS);
      if (origins.indexOf(origin) !== -1) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'));
      }
    },
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(configured.session);

initStrategies();
app.use(passport.initialize());
app.use(passport.session());
initRoutes(app);

const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  if (err) {
    return res.status(err.statusCode || 500).json(err);
  }

  next();
};

app.use(errorHandler);

export default app;
