const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generateCertificate(name, score) {

  const dir = path.join(__dirname, "certificates");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const fileName = `certificate_${name}_${Date.now()}.pdf`;
  const filePath = path.join(dir, fileName);

  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margin: 50
  });

  doc.pipe(fs.createWriteStream(filePath));

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  // 🔵 Background border (dynamic size)
  doc
    .lineWidth(3)
    .strokeColor("#6a1b9a")
    .rect(20, 20, pageWidth - 40, pageHeight - 40)
    .stroke();

  // 🎨 Top Design
  doc
    .fillColor("#6a1b9a")
    .rect(0, 0, pageWidth, 120)
    .fill();

  // 🎨 Bottom Design
  doc
    .fillColor("#1976d2")
    .rect(0, pageHeight - 100, pageWidth, 120)
    .fill();

  // 🏆 Title (CENTERED)
  doc
    .fillColor("white")
    .fontSize(40)
    .text("CERTIFICATE", 0, 40, {
      align: "center"
    });

  doc
    .fontSize(20)
    .text("of Appreciation", 0, 80, {
      align: "center"
    });

  // 🎯 Subtitle
  doc
    .fillColor("black")
    .fontSize(14)
    .text("THIS CERTIFICATE IS PROUDLY PRESENTED TO", 0, 180, {
      align: "center"
    });

  // 🧑 Name (CENTERED)
  doc
    .fontSize(36)
    .fillColor("#6a1b9a")
    .text(name, 0, 220, {
      align: "center"
    });

  // 📜 Description (CENTERED BLOCK)
  doc
    .fontSize(16)
    .fillColor("black")
    .text(
      `For successfully completing the quiz with a score of ${score}.`,
      100,
      280,
      {
        align: "center",
        width: pageWidth - 200
      }
    );

  // 📅 Date
  const date = new Date().toLocaleDateString();

  doc
    .fontSize(12)
    .text("DATE", 150, pageHeight - 150);

  doc
    .moveTo(120, pageHeight - 160)
    .lineTo(240, pageHeight - 160)
    .stroke();

  doc.text(date, 130, pageHeight - 135);

  // ✍ Signature
  doc
    .text("SIGNATURE", pageWidth - 200, pageHeight - 150);

  doc
    .moveTo(pageWidth - 220, pageHeight - 160)
    .lineTo(pageWidth - 80, pageHeight - 160)
    .stroke();

  doc.text("Quiz Admin", pageWidth - 200, pageHeight - 135);

  doc.end();

  return `certificates/${fileName}`;
}

module.exports = generateCertificate;