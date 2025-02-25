const fs = require("fs");
const path = require("path");

const deleteFile = (filepath) => {
  const thumbnailPath = path.join(
    __dirname,
    "..",
    "public",
    "event",
    "thumb_event",
    path.basename(filepath)
  );
  if (fs.existsSync(thumbnailPath)) {
    fs.unlinkSync(thumbnailPath);
  }
};

module.exports = { deleteFile };
