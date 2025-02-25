"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Events", {
      id: {
        allowNull: false,
        primaryKey: true,
        unique: true,
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      thumbnail: {
        type: Sequelize.STRING,
      },
      date_start: {
        type: Sequelize.DATEONLY,
      },
      date_end: {
        type: Sequelize.DATEONLY,
      },
      time_start: {
        type: Sequelize.STRING,
      },
      time_end: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
      },
      eventType: {
        type: Sequelize.ENUM("online", "offline"),
        defaultValue: "online",
      },
      isFree: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      price: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      categoryId: {
        type: Sequelize.STRING,
      },
      organizerId: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Events");
  },
};
