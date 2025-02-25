"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: "Email tidak valid",
          },
        },
      },
      nohandphone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[0-9]{10,15}$/,
            msg: "Nomor handphone tidak valid",
          },
        },
      },
      nim: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      isMahasiswa: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      role: {
        type: DataTypes.ENUM("organizer", "participant"),
      },
      refreshToken: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
