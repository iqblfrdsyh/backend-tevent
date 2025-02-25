"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Event.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      thumbnail: DataTypes.STRING,
      date_start: DataTypes.DATEONLY,
      date_end: DataTypes.DATEONLY,
      time_start: DataTypes.STRING,
      time_end: DataTypes.STRING,
      location: DataTypes.STRING,
      eventType: DataTypes.ENUM("online", "offline"),
      isFree: DataTypes.BOOLEAN,
      price: DataTypes.FLOAT,
      categoryId: DataTypes.STRING,
      organizerId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
