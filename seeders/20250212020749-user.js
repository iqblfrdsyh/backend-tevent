"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("John123_", 15);

    return await queryInterface.bulkInsert("Users", [
      {
        fullname: "John Doe",
        username: "johndoe",
        password: hashedPassword,
        email: "johndoe@example.com",
        nohandphone: "+6283832397149",
        refreshToken: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullname: "Jane Doe 2",
        username: "janedoe2",
        password: hashedPassword,
        email: "janedoe2@example.com",
        nohandphone: "6285123456789",
        refreshToken: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete("Users", null, {});
  },
};
