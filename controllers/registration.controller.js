const { handleError } = require("../helper/function");
const generateUniqID = require("../helper/generateId");
const { Registration, User, Event } = require("../helper/ralation");
const midtransClient = require("midtrans-client");
const saveToExcelByEvent = require("../helper/saveToExcel");

const midtrans = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.SERVER_KEY,
  clientKey: process.env.CLIENT_KEY,
});

exports.createRegistration = async (req, res) => {
  try {
    const { presence, userId, eventId } = req.body;

    if (!presence || !userId || !eventId) {
      return handleError(res, 400, "Semua field harus diisi.");
    }

    // const existingRegistration = await Registration.findOne({
    //   where: { userId, eventId },
    // });
    // if (existingRegistration) {
    //   return handleError(res, 400, "User sudah terdaftar untuk event ini.");
    // }

    const [user, event] = await Promise.all([
      User.findOne({ where: { id: userId } }),
      Event.findOne({ where: { id: eventId } }),
    ]);

    if (!user) return handleError(req, 404, "User tidak ditemukan");
    if (!event) return handleError(req, 404, "Event tidak ditemukan");

    const registrationId = generateUniqID("reg");

    if (event.isFree) {
      const newRegistration = await Registration.create({
        id: registrationId,
        presence,
        statusPayment: "paid",
        userId,
        eventId,
      });

      saveToExcelByEvent(eventId, newRegistration, user, event);

      return res.status(201).json({
        message: "Registrasi berhasil",
        data: newRegistration,
      });
    }

    const parameter = {
      transaction_details: {
        order_id: registrationId,
        gross_amount: event.price * 1,
      },
      item_details: [
        {
          id: eventId,
          name: event.title,
          price: event.price,
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

    const newRegistration = await Registration.create({
      id: registrationId,
      presence,
      statusPayment: "pending",
      userId,
      eventId,
    });

    saveToExcelByEvent(eventId, newRegistration, user, event);

    return res.status(201).json({
      message: "Registrasi berhasil",
      data: newRegistration,
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
    const registration = await Registration.findOne({ where: { id: orderId } });
    if (!registration)
      return handleError(
        res,
        404,
        `Registrasi dengan id ${orderId} tidak di temukan`
      );

    let newStatus;
    if (transaction_status === "capture" && fraud_status === "accept") {
      newStatus = "paid";
    } else if (transaction_status === "settlement") {
      newStatus = "paid";
    } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
      newStatus = "failed";
    } else if (transaction_status === "pending") {
      newStatus = "pending";
    } else {
      newStatus = registration.statusPayment;
    }

    await registration.update({
      statusPayment: newStatus,
    });

    const [user, event] = await Promise.all([
      User.findOne({ where: { id: registration.userId } }),
      Event.findOne({ where: { id: registration.eventId } }),
    ]);

    if (user && event) {
      saveToExcelByEvent(registration.eventId, registration, user, event);
    }

    res.status(200).json({ message: "Ok", data: registration });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};
