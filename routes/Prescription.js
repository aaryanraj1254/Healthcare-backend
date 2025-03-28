const express = require("express");
const Prescription = require("../models/Prescription");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const generatePrescriptionPDF = require("../utils/pdfGenerator");

// Doctor creates a prescription
router.post("/create", authenticate, async (req, res) => {
    try {
        const { patientId, medicines } = req.body;
        const newPrescription = new Prescription({
            doctor: req.user.id,
            patient: patientId,
            medicines
        });

        await newPrescription.save();
        res.json({ success: true, message: "Prescription saved successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Patient fetches their prescriptions
router.get("/my", authenticate, async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ patient: req.user.id }).populate("doctor", "name");
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
