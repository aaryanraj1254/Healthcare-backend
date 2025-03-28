const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');
const router = express.Router();

// Register Doctor
router.post('/register/doctor', async (req, res) => {
    try {
        const { name, email, password, specialty, availability } = req.body;

        // Check if doctor already exists
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) return res.status(400).json({ message: 'Doctor already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const doctor = new Doctor({
            name,
            email,
            password: hashedPassword,
            specialty,
            availability,
        });

        await doctor.save();
        res.status(201).json({ message: 'Doctor registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Register Patient
router.post('/register/patient', async (req, res) => {
    try {
        const { name, email, password, age } = req.body;

        // Check if patient already exists
        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) return res.status(400).json({ message: 'Patient already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const patient = new Patient({
            name,
            email,
            password: hashedPassword,
            age,
        });

        await patient.save();
        res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login Doctor
router.post('/login/doctor', async (req, res) => {
    try {
        const { email, password } = req.body;

        const doctor = await Doctor.findOne({ email });
        if (!doctor) return res.status(400).json({ message: 'Doctor not found' });

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: doctor._id, role: 'doctor' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, doctor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login Patient
router.post('/login/patient', async (req, res) => {
    try {
        const { email, password } = req.body;

        const patient = await Patient.findOne({ email });
        if (!patient) return res.status(400).json({ message: 'Patient not found' });

        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: patient._id, role: 'patient' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, patient });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
