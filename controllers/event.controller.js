const { deleteFile } = require("../helper/deleteFile");
const { handleError, trimmedValue } = require("../helper/function");
const generateUniqID = require("../helper/generateId");
const { Event, User, Category } = require("../helper/ralation");

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findAll({
      include: [
        {
          model: User,
          as: "organizer",
          attributes: ["id", "fullname", "email", "nohandphone"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });
    if (event.length < 1) return handleError(res, 404, "Data tidak ada");

    return res
      .status(200)
      .json({ message: "success", total: event.length, data: event });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return handleError(res, 400, "Membutuhkan id event");
    const event = await Event.findOne({
      where: { id },
      include: [
        {
          Model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          Model: User,
          as: "organizer",
          attributes: ["id", "fullname", "email", "nohandphone"],
        },
      ],
    });
    if (!event)
      return handleError(res, 404, `Event dengan id '${id}' tidak di temukan`);
    return res.status(200).json({ message: "success", data: event });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

exports.searchEventByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    const validCategory = await Category.findOne({ where: { name: category } });
    if (!validCategory) return handleError(res, 404, "Kategori tidak ada");

    const events = await Event.findAll({
      include: [
        {
          model: Category,
          as: "category",
          where: { name: category },
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "organizer",
          attributes: ["id", "fullname", "email", "nohandphone"],
        },
      ],
    });

    if (events.length < 1)
      return handleError(res, 404, "Tidak ada event dalam kategori ini");

    return res.status(200).json({
      message: "success",
      total: events.length,
      data: events,
    });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date_start,
      date_end,
      time_start,
      time_end,
      location,
      eventType,
      isFree,
      price,
      categoryId,
      organizerId,
    } = req.body;
    const file = req.file;

    if (
      ![
        title,
        description,
        date_start,
        date_end,
        time_start,
        time_end,
        location,
        eventType,
        isFree,
        price,
        categoryId,
        organizerId,
      ].every(trimmedValue)
    ) {
      return handleError(res, 400, "Semua field harus diisi");
    }

    if (!file) {
      return handleError(res, 400, "Thumbnail wajib diunggah");
    }

    const thumbnailUrl = `${req.protocol}://${req.get("host")}/thumb_event/${
      file.filename
    }`;

    // const organizer = await User.findOne({where: {id: organizerId}});
    // const category = await Category.findOne({where: {id: categoryId}});
    const [organizer, category] = await Promise.all([
      User.findOne({ where: { id: organizerId } }),
      Category.findOne({ where: { id: categoryId } }),
    ]);

    if (!category)
      return handleError(
        res,
        404,
        `Tidak ada category dengan ID '${categoryId}'`
      );

    if (!organizer) {
      deleteFile(thumbnailUrl);
      return handleError(
        res,
        404,
        `Tidak ada organizer dengan ID '${organizerId}'`
      );
    }
    if (organizer.role == "participant") {
      deleteFile(thumbnailUrl);
      return handleError(res, 400, "Ilegal role");
    }

    const event = await Event.create({
      id: generateUniqID("eid"),
      thumbnail: thumbnailUrl,
      title,
      description,
      date_start,
      date_end,
      time_start,
      time_end,
      location,
      eventType,
      isFree: isFree || false,
      price: parseInt(price),
      categoryId,
      organizerId,
    });

    res.status(201).json({ message: "Event berhasil dibuat", data: event });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) {
      return handleError(res, 404, "Event tidak ditemukan");
    }

    deleteFile(event.thumbnail);

    await Event.destroy({ where: { id } });

    return res.status(200).json({ message: "Event berhasil dihapus" });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};
