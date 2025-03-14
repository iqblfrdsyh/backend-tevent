"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        primaryKey: true,
        unique: true,
        type: Sequelize.STRING,
      },
      fullname: {
        type: Sequelize.STRING,
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        type: Sequelize.TEXT,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      nohandphone: {
        type: Sequelize.STRING,
        unique: true,
      },
      nim: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      isMahasiswa: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      refreshToken: {
        type: Sequelize.TEXT,
      },
      role: {
        type: Sequelize.ENUM("organizer", "user"),
        allowNull: false,
        defaultValue: "user",
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
    await queryInterface.dropTable("Users");
  },
};
