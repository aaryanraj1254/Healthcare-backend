const express = require('express');
const router = express.Router();
const symptomController = require('../controllers/symptomController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/diagnose', authMiddleware, symptomController.getDiagnosis);
module.exports = router;