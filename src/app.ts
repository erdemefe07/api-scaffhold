import { express, passport, cookieParser, configured } from './loaders';

import initStrategies from './strategies';
import initRoutes from './routes';

const app = express();

app.use(configured.helmet);
app.use(configured.cors);
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
