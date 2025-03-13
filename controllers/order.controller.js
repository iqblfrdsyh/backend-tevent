const { handleError } = require("../helper/function");
const generateUniqID = require("../helper/generateId");
const { User, Event, Ticket, Order } = require("../helper/ralation");
const midtransClient = require("midtrans-client");
const saveToExcelByEvent = require("../helper/saveToExcel");

const midtrans = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.SERVER_KEY,
  clientKey: process.env.CLIENT_KEY,
});

exports.createOrder = async (req, res) => {
  try {
    const { userId, eventId, ticketId } = req.body;

    if (!userId || !eventId || !ticketId) {
      return handleError(res, 400, "Semua field harus diisi.");
    }

    const [user, ticket, event] = await Promise.all([
      User.findOne({ where: { id: userId } }),
      Ticket.findOne({ where: { id: ticketId } }),
      Event.findOne({ where: { id: eventId } }),
    ]);

    if (!user) return handleError(res, 404, "User tidak ditemukan");
    if (!ticket) return handleError(res, 404, "Ticket tidak ditemukan");
    if (!event) return handleError(res, 404, "Event tidak ditemukan");

    const orderId = generateUniqID("reg");

    if (ticket.price === 0) {
      const newOrder = await Registration.create({
        id: orderId,
        presence,
        statusPayment: "paid",
        userId,
        eventId,
        ticketId,
      });

      saveToExcelByEvent(eventId, newOrder, user, event, ticket);

      return res.status(201).json({
        message: "Registrasi berhasil",
        data: newOrder,
      });
    }

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: ticket.price,
      },
      item_details: [
        {
          id: ticketId,
          name: ticket.name,
          price: ticket.price,
          quantity: 1,
        },
      ],
      customer_details: {
        first_name: user.fullname,
        email: user.email,
        phone: user.nohandphone,
      },
    };

    const token = await midtrans.createTransactionToken(parameter);

    const newOrder = await Order.create({
      id: orderId,
      statusPayment: "pending",
      userId,
      eventId,
      ticketId,
    });

    saveToExcelByEvent(newOrder, user, event, ticket);

    const ticketData = await Ticket.findOne({ where: { id: ticketId } });
    if (ticketData) {
      const ticketQuantity = parseInt(ticketData.quantity) - 1;
      await ticketData.update({ quantity: ticketQuantity });
    }

    return res.status(201).json({
      message: "Order berhasil",
      data: newOrder,
      token,
    });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

exports.midtransWebHook = async (req, res) => {
  try {
    const { orderId } = req.query;

    const statusResponse = await midtrans.transaction.status(orderId);
    const { transaction_status, fraud_status } = statusResponse;

    const order = await Order.findOne({ where: { id: orderId } });
    if (!order)
      return handleError(
        res,
        404,
        `Data Order dengan id ${orderId} tidak ditemukan`
      );

    let newStatus;
    if (transaction_status === "capture" && fraud_status === "accept") {
      newStatus = "paid";
    } else if (transaction_status === "settlement") {
      newStatus = "paid";
    } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
      newStatus = "failed";
      const ticket = await Ticket.findOne({
        where: { ticketId: order.ticketId },
      });
      if (ticket) {
        const ticketQuantity = parseInt(ticket.quantity) + 1;
        await ticket.update({ quantity: ticketQuantity });
      }
    } else if (transaction_status === "pending") {
      newStatus = "pending";
    } else {
      newStatus = order.statusPayment;
    }

    await order.update({
      statusPayment: newStatus,
    });

    const [user, event, ticket] = await Promise.all([
      User.findOne({ where: { id: order.userId } }),
      Event.findOne({ where: { eventId: order.eventId } }),
      Ticket.findOne({ where: { ticketId: order.ticketId } }),
    ]);

    if (user && event) {
      saveToExcelByEvent(order, user, event, ticket);
    }

    res.status(200).json({ message: "Ok", data: order });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};
