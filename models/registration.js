"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Registration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Registration.init(
    {
      id: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true,
      },
      presence: DataTypes.ENUM("online", "offline"),
      statusPayment: DataTypes.ENUM("pending", "paid", "failed"),
      userId: DataTypes.STRING,
      eventId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Registration",
    }
  );
  return Registration;
};
