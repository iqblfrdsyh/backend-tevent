const { handleError, trimmedValue } = require("../helper/function");
const generateUniqID = require("../helper/generateId");
const { Category } = require("../helper/ralation");

exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findAll();
    if (category.length < 1) return handleError(res, 404, "Data tidak ada");

    res
      .status(200)
      .json({ message: "success", total: category.length, data: category });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!trimmedValue(name))
      return handleError(res, 400, "Nama kategori tidak boleh kosong");

    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) return handleError(res, 400, "Kategori sudah ada");

    const category = await Category.create({ id: generateUniqID("cid"), name });
    res.status(201).json({ message: "created", data: category });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return handleError(res, 404, `Data dengan id ${id} tidak ada`);
    }
    await category.destroy();
    res.status(200).json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};
