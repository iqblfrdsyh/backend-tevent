const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const saveToExcelByEvent = (eventId, registration, user, event) => {
  const dirPath = path.join(__dirname, "../public/event/reports");
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, `event-${eventId}.xlsx`);
  let workbook;
  let sheetName = `Registration Report for ${event.title}`;
  let worksheet;

  if (fs.existsSync(filePath)) {
    workbook = xlsx.readFile(filePath);
    worksheet = workbook.Sheets[sheetName];
  } else {
    workbook = xlsx.utils.book_new();
    worksheet = xlsx.utils.json_to_sheet([]);
    xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  let data = xlsx.utils.sheet_to_json(worksheet);

  const existingIndex = data.findIndex((row) => row.ID === registration.id);

  const newData = {
    ID: registration.id,
    "Nama Lengkap": user.fullname,
    Mahasiswa: user.isMahasiswa ? "Ya" : "Tidak",
    NIM: user.nim || "-",
    Email: user.email,
    "Nomor HP": user.nohandphone,
    "Nama Event": event.title,
    Kehadiran: registration.presence,
    "Harga (IDR)": `Rp ${event.price.toLocaleString("id-ID")}`,
    "Status Pembayaran":
      registration.statusPayment === "paid" ? "Lunas" : "Belum Lunas",
    "Waktu Registrasi": new Date(registration.createdAt).toLocaleString(
      "id-ID",
      {
        timeZone: "Asia/Jakarta",
        hour12: false,
      }
    ),
  };

  if (existingIndex !== -1) {
    data[existingIndex] = newData;
  } else {
    data.push(newData);
  }

  data.sort(
    (a, b) => new Date(a["Waktu Registrasi"]) - new Date(b["Waktu Registrasi"])
  );

  const newWorksheet = xlsx.utils.json_to_sheet(data, {
    header: Object.keys(newData),
  });

  const range = xlsx.utils.decode_range(newWorksheet["!ref"]);
  for (let C = range.s.c; C <= range.e.c; C++) {
    const cell_address = xlsx.utils.encode_col(C) + "1";
    if (newWorksheet[cell_address]) {
      newWorksheet[cell_address].s = {
        font: { bold: true, name: "Arial" },
        alignment: { horizontal: "center" },
      };
    }
  }

  newWorksheet["!cols"] = [
    { wch: 10 }, // ID
    { wch: 20 }, // Nama Lengkap
    { wch: 10 }, // Mahasiswa
    { wch: 12 }, // NIM
    { wch: 25 }, // Email
    { wch: 15 }, // Nomor HP
    { wch: 25 }, // Nama Event
    { wch: 12 }, // Kehadiran
    { wch: 15 }, // Harga (IDR)
    { wch: 18 }, // Status Pembayaran
    { wch: 20 }, // Waktu Registrasi
  ];

  workbook.Sheets[sheetName] = newWorksheet;

  xlsx.writeFile(workbook, filePath);
};

module.exports = saveToExcelByEvent;
