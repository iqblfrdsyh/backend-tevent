const { trimmedValue, handleError } = require("../helper/function");
const { User } = require("../helper/ralation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateUniqID = require("../helper/generateId");

exports.getUser = async (req, res) => {
  try {
    const users = await User.findAll();
    if (users.length < 1) {
      return handleError(res, 404, "Data tidak ada");
    }
    return res
      .status(200)
      .json({ message: "Success", total: users.length, data: users });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

exports.registerUser = async (req, res) => {
  try {
    const {
      fullname,
      username,
      password,
      confirmPassword,
      email,
      nohandphone,
      nim,
      isMahasiswa,
      role,
    } = req.body;

    if (
      ![
        fullname,
        username,
        password,
        confirmPassword,
        email,
        nohandphone,
        role,
      ].every(trimmedValue)
    ) {
      return handleError(res, 400, "Semua field harus diisi");
    }

    if (password !== confirmPassword) {
      return handleError(
        res,
        400,
        "Password dan konfirmasi password tidak cocok"
      );
    }

    const [existingUser, existingEmail, existingNohandphone] =
      await Promise.all([
        User.findOne({ where: { username } }),
        User.findOne({ where: { email } }),
        User.findOne({ where: { nohandphone } }),
      ]);

    if (existingUser || existingEmail) {
      if (existingNohandphone) {
        return handleError(res, 400, "No handphone sudah digunakan");
      }
      return handleError(res, 400, "Username atau email sudah digunakan");
    }

    const hashedPassword = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10)
    );

    const newUser = await User.create({
      id: generateUniqID("uid"),
      fullname,
      username,
      password: hashedPassword,
      email,
      nohandphone,
      nim: nim || 0,
      isMahasiswa: isMahasiswa || false,
      role: role || "participant",
    });

    return res
      .status(201)
      .json({ message: "Pendaftaran berhasil", user: newUser });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return handleError(res, 404, "Username tidak ditemukan");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return handleError(res, 400, "Password salah!");
    }

    const { id: userId, fullname, email, nohandphone } = user;
    const accessToken = jwt.sign(
      { userId, email },
      process.env.SECRET_ACCESS_TOKEN,
      { expiresIn: "2m" }
    );
    const refreshToken = jwt.sign(
      { userId, email },
      process.env.SECRET_REFRESH_TOKEN,
      { expiresIn: "1d" }
    );

    await User.update({ refreshToken }, { where: { id: userId } });

    res.cookie("refreshToken", refreshToken, { maxAge: 24 * 60 * 60 * 1000 });
    req.user = { userId, fullname, email, nohandphone };

    return res.json({ accessToken });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

exports.logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  try {
    const user = await User.findOne({ where: { refreshToken } });
    if (!user) return res.sendStatus(204);

    await User.update({ refreshToken: null }, { where: { id: user.id } });

    res.clearCookie("refreshToken");
    return res.json({ message: "Logout berhasil" });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};
