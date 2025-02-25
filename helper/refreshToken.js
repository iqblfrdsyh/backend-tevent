const { User } = require("./ralation");
const jwt = require("jsonwebtoken");

exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const user = await User.findOne({ where: { refreshToken } });
    if (!user) return res.sendStatus(403);

    jwt.verify(
      refreshToken,
      process.env.SECRET_REFRESH_TOKEN,
      (err, decoded) => {
        if (err) return res.sendStatus(403);

        const accessToken = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.SECRET_ACCESS_TOKEN,
          { expiresIn: "2m" }
        );
        return res.json({ accessToken });
      }
    );
  } catch (error) {
    return res.sendStatus(500);
  }
};
