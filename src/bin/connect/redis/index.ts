import Redis from 'ioredis';

let client: Redis.Redis = null;

const connectPromise: Promise<Redis.Redis> = new Promise((resolve, reject) => {
  if (client) {
    return resolve(client);
  }

  client = new Redis(process.env.REDIS_URI);

  client.on('error', error => {
    console.log('Error on connection redis');
    console.error(error);
    return reject();
  });

  client.on('ready', () => resolve(client));
});

const getClient = () => {
  if (client) {
    return client;
  }

  return connectPromise;
};

const connect = async (time = Date.now()) => {
  await connectPromise;
  console.log(`Redis connected after: ${Date.now() - time}ms`);
};

export default connect;
export { getClient };
