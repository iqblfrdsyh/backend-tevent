const sequelize = require("../models/index.js").sequelize;
const { DataTypes } = require("sequelize");

const User = require("../models/user.js")(sequelize, DataTypes);
const Category = require("../models/category.js")(sequelize, DataTypes);
const Event = require("../models/event.js")(sequelize, DataTypes);
const Registration = require("../models/registration.js")(sequelize, DataTypes);

User.hasMany(Event, {
  foreignKey: "organizerId",
  as: "organizedEvents",
  onDelete: "CASCADE",
});

Event.belongsTo(User, {
  foreignKey: "organizerId",
  as: "organizer",
  onDelete: "CASCADE",
});

Event.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
  onDelete: "CASCADE",
});

Category.hasOne(Event, {
  foreignKey: "categoryId",
  as: "event",
  onDelete: "CASCADE",
});

Event.hasMany(Registration, {
  foreignKey: "eventId",
  as: "registrations",
  onDelete: "CASCADE",
});
Registration.belongsTo(Event, {
  foreignKey: "eventId",
  as: "event",
});

User.hasMany(Registration, {
  foreignKey: "userId",
  as: "registrations",
  onDelete: "CASCADE",
});
Registration.belongsTo(User, {
  foreignKey: "userId",
  as: "participant",
});


module.exports = { User, Category, Event, Registration };
