const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware'); // Import the JWT middleware

// Protected route: Only authenticated patients can access this
router.get('/', verifyToken, (req, res) => {
    res.json({
        message: 'Welcome to the Patient Dashboard',
        patient: req.user  // `req.user` contains the patient's data after token verification
    });
});

module.exports = router;
