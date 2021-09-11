import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.POSTGRES_URI);

async function connect(time = Date.now()) {
  try {
    await sequelize.authenticate({ logging: false });
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true, logging: false });
    }
    console.log(`Postgres connected after: ${Date.now() - time}ms`);
  } catch (error) {
    throw new Error('Cannot to connect dependency');
  }
}

export default connect;
export { sequelize };
