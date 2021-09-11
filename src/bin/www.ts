/* eslint-disable import/first */
import http from 'http';
import { configure } from './config';

configure();
import app from '../app';
import waitForDependencies from './connect';

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
const server = http.createServer(app);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val: string) {
  const _port = parseInt(val, 10);

  if (Number.isNaN(_port)) {
    return val;
  }

  if (_port >= 0) {
    return _port;
  }

  return false;
}

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address() as import('net').AddressInfo;
  console.log(`Running at http://localhost:${addr.port}`);
}

async function bootstrap() {
  await waitForDependencies();
  server.listen(port);
}

bootstrap();
