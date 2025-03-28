const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    medicalHistory: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);
