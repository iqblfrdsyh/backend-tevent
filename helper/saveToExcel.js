const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const saveToExcelByEvent = (order, user, event, ticket) => {
  const dirPath = path.join(__dirname, "../public/event/reports");
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, `event-${event.name}.xlsx`);
  let workbook;
  
  let sheetName = `Order-${event.name}`.substring(0, 31).replace(/[\[\]:\*\?\/\\]/g, "");

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

  const existingIndex = data.findIndex((row) => row.ID === order.id);

  const newData = {
    ID: order.id,
    "Nama Lengkap": user.fullname,
    Mahasiswa: user.isMahasiswa ? "Ya" : "Tidak",
    NIM: user.nim || "-",
    Email: user.email,
    "Nomor HP": user.nohandphone,
    "Nama Event": event.name,
    "Harga (IDR)": `Rp ${ticket.price.toLocaleString("id-ID")}`,
    "Status Pembayaran": order.statusPayment === "paid" ? "Lunas" : "Belum Lunas",
    "Waktu Registrasi": new Date(order.createdAt).toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour12: false,
    }),
  };

  if (existingIndex !== -1) {
    data[existingIndex] = newData;
  } else {
    data.push(newData);
  }

  data.sort((a, b) => new Date(a["Waktu Registrasi"]) - new Date(b["Waktu Registrasi"]));

  const newWorksheet = xlsx.utils.json_to_sheet(data, {
    header: Object.keys(newData),
  });

  newWorksheet["!cols"] = [
    { wch: 10 }, // ID
    { wch: 20 }, // Nama Lengkap
    { wch: 10 }, // Mahasiswa
    { wch: 12 }, // NIM
    { wch: 25 }, // Email
    { wch: 15 }, // Nomor HP
    { wch: 25 }, // Nama Event
    { wch: 15 }, // Harga 
    { wch: 18 }, // Status Pembayaran
    { wch: 20 }, // Waktu Registrasi
  ];

  workbook.Sheets[sheetName] = newWorksheet;
  xlsx.writeFile(workbook, filePath);
};

module.exports = saveToExcelByEvent;
