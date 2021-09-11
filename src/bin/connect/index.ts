import connectPostgres from './postgres';
import connectRedis from './redis';

export default async function connectAll() {
  const now = Date.now();
  await Promise.all([connectPostgres(now), connectRedis(now)]);
  console.log(`Connected all dependencies after: ${Date.now() - now}ms`);
}
