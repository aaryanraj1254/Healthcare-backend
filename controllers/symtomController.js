const axios = require('axios'); // For calling Anshu's ML API
const User = require('../models/userModel');

exports.getDiagnosis = async (req, res) => {
  try {
    const { symptoms } = req.body;
    const userId = req.user.id;

    // 1. Call Anshu's ML API (replace URL with his endpoint)
    const mlResponse = await axios.post('http://ml-service:5000/predict', {
      symptoms
    });

    // 2. Save to user history
    await User.findByIdAndUpdate(userId, {
      $push: {
        symptomsHistory: {
          symptoms,
          diagnosis: mlResponse.data.diagnosis,
          prescription: mlResponse.data.prescription
        }
      }
    });

    // 3. Return ML results
    res.json({
      diagnosis: mlResponse.data.diagnosis,
      prescription: mlResponse.data.prescription
    });
  } catch (err) {
    res.status(500).json({ error: "ML service unavailable" });
  }
};