const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware'); // Import the JWT middleware

// Protected route: Only authenticated doctors can access this
router.get('/', verifyToken, (req, res) => {
    res.json({
        message: 'Welcome to the Doctor Dashboard',
        doctor: req.user  // `req.user` contains the doctor's data after token verification
    });
});

module.exports = router;
