import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@postgres';
import { hash } from 'bcrypt';
import PasswordValidator from 'password-validator';

const schema = new PasswordValidator();
// 8-100 karakter arası en az 1 küçük, 1 büyük karakter, 1 sayı, 1 sembol
schema.is().min(8).is().max(100).has().uppercase().has().lowercase().has().digits().has().symbols();
interface UserAttributes {
  id: number;
  email: string;
  displayName: string | null;
  avatar: string | null;
  password: string | null;
  verified: boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;

  public email!: string;

  public displayName!: string | null;

  public avatar!: string | null;

  public password!: string | null;

  public verified!: boolean;

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
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    displayName: {
      type: DataTypes.STRING(25),
      allowNull: true,
      validate: {
        len: [3, 25],
      },
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    hooks: {
      async beforeUpdate(user) {
        const isPasswordModified = user.changed('password');
        if (!isPasswordModified) {
          return undefined;
        }

        const password = await hash(user.password, 10);
        user.password = password;
      },

      async beforeValidate(user) {
        // TODO burayı deneyiniz
        if (!user.password) {
          return undefined;
        }

        const result = schema.validate(user.password, { list: true });
        if (result.length > 0) {
          throw {
            statusCode: 400,
            message: 'Password must have 1 lettercase, 1 uppercase, 1 digit, 1 symbol',
            error: true,
          };
        }
      },
    },
  }
);

export { User };
