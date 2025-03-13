const { trimmedValue, handleError } = require("../helper/function");
const generateUniqID = require("../helper/generateId");
const { Ticket, Event } = require("../helper/ralation");

exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findAll();
    if (ticket.length < 1) {
      return handleError(res, 404, "Data tidak ada");
    }
    return res
      .status(200)
      .json({ message: "Success", total: ticket.length, data: ticket });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

exports.createTicket = async (req, res) => {
  try {
    const { name, price, eventId, description, quantity } = req.body;
    if (![name, price, eventId, description, quantity].every(trimmedValue)) {
      return handleError(res, 400, "Semua field harus diisi");
    }

    const event = await Event.findOne({ where: { id: eventId } });
    if (!event) {
      return handleError(
        res,
        404,
        `Event dengan id ${eventId} tidak ditemukan`
      );
    }

    const ticket = await Ticket.create({
      id: generateUniqID("tic"),
      name,
      price: price || 0,
      eventId,
      description,
      quantity: quantity || 0,
    });
    return res.status(201).json({
      message: "Ticket berhasil dibuat",
      data: ticket,
    });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, eventId, description, quantity } = req.body;
    if (![name, price, eventId, description, quantity].every(trimmedValue)) {
      return handleError(res, 400, "Semua field harus diisi");
    }
    const ticket = await Ticket.findOne({ where: { id } });
    if (!ticket) {
      return handleError(res, 404, `Ticket dengan id ${id} tidak ditemukan`);
    }
    ticket.name = name;
    ticket.price = price;
    ticket.eventId = eventId;
    ticket.description = description;
    ticket.quantity = quantity;

    await ticket.save();

    return res.status(200).json({
      message: "Ticket berhasil diupdate",
      data: ticket,
    });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findOne({ where: { id } });
    if (!ticket) {
      return handleError(res, 404, `Ticket dengan id ${id} tidak ditemukan`);
    }
    await ticket.destroy();
    return res.status(200).json({ message: "Ticket berhasil dihapus" });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};
