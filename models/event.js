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
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      thumbnail: DataTypes.STRING,
      date_start: DataTypes.DATE,
      date_end: DataTypes.DATE,
      location: DataTypes.STRING,
      isOnline: DataTypes.BOOLEAN,
      isPublish: DataTypes.BOOLEAN,
      isFeatured: DataTypes.BOOLEAN,
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
