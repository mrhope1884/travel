const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth.controller');

const errorHandler = require('../middlewares/error.middleware');

const auth = require('../middlewares/auth.middleware').verifyToken;

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/admin/login', authController.adminLogin);

router.use(auth); // Áp dụng middleware auth cho tất cả các route phía dưới



router.use(errorHandler);

module.exports = router;