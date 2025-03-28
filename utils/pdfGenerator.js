const PDFDocument = require("pdfkit");
const fs = require("fs");

const generatePrescriptionPDF = (prescription, res) => {
    const doc = new PDFDocument();
    res.setHeader("Content-Disposition", `attachment; filename=prescription_${prescription._id}.pdf`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Title
    doc.fontSize(18).text("Medical Prescription", { align: "center" });
    doc.moveDown();

    // Doctor & Patient Info
    doc.fontSize(12).text(`Doctor: ${prescription.doctor.name}`);
    doc.text(`Patient: ${prescription.patient.name}`);
    doc.moveDown();

    // Medicines List
    doc.text("Medicines Prescribed:", { underline: true });
    prescription.medicines.forEach((med, index) => {
        doc.text(`${index + 1}. ${med.name} - ${med.dosage} (${med.instructions})`);
    });

    doc.moveDown();
    doc.text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`);

    // End PDF
    doc.end();
};

module.exports = generatePrescriptionPDF;
