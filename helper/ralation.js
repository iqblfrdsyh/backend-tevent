const sequelize = require("../models/index.js").sequelize;
const { DataTypes } = require("sequelize");

const User = require("../models/user.js")(sequelize, DataTypes);
const Category = require("../models/category.js")(sequelize, DataTypes);
const Event = require("../models/event.js")(sequelize, DataTypes);
const Order = require("../models/order.js")(sequelize, DataTypes);
const Ticket = require("../models/ticket.js")(sequelize, DataTypes);

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

Event.hasMany(Order, {
  foreignKey: "eventId",
  as: "orders",
  onDelete: "CASCADE",
});
Order.belongsTo(Event, {
  foreignKey: "eventId",
  as: "event",
});

User.hasMany(Order, {
  foreignKey: "userId",
  as: "orders",
  onDelete: "CASCADE",
});
Order.belongsTo(User, {
  foreignKey: "userId",
  as: "participant",
});

Ticket.belongsTo(Event, {
  foreignKey: "eventId",
  as: "event",
  onDelete: "CASCADE",
});
Event.hasMany(Ticket, {
  foreignKey: "eventId",
  as: "tickets",
  onDelete: "CASCADE",
});

module.exports = { User, Category, Event, Order, Ticket };
