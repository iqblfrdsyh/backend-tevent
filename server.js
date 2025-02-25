require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const routers = require("./routers/index");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/v1", (req, res) => {
  res.status(200).json({ message: "Welcome to api TEvent" });
});

Object.values(routers).forEach((routes) => {
  app.use("/api/v1", routes);
});

app.get("/excel/download/:eventId", (req, res) => {
  const { eventId } = req.params;
  const filePath = path.join(
    __dirname,
    "./public/event/reports",
    `event-${eventId}.xlsx`
  );

  if (fs.existsSync(filePath)) {
    res.download(filePath, `event-${eventId}.xlsx`, (err) => {
      if (err) {
        res
          .status(500)
          .json({ message: "Gagal mengunduh file", error: err.message });
      }
    });
  } else {
    res.status(404).json({ message: "File tidak ditemukan" });
  }
});

app.get("*", (req, res) => {
  res.status(404).json({ message: "endpoint not found" });
});

app.listen(port, () => {
  console.log(`Server ready on http://localhost:${port}`);
});
