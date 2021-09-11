import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@postgres';

interface UserAttributes {
  id: number;
  email: string;
  displayName: string | null;
  avatar: string | null;
  password: string | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;

  public email!: string;

  public displayName!: string | null;

  public avatar!: string | null;

  public password!: string | null;

  public readonly createdAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    defaultScope: {
      attributes: {
        exclude: ['password'],
      },
    },
    sequelize,
    modelName: 'User',
    tableName: 'Users',
  }
);

export { User };
