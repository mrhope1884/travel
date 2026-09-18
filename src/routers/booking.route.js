const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//bắt buộc đăng nhập mới được tạo booking
router.post("/create", authMiddleware.verifyToken, bookingController.createBooking);

//bắt buộc đăng nhập mới được xem booking
router.get("/all", authMiddleware.verifyToken, bookingController.getAllBookings);

// Hủy booking và hoàn lại ghế (hỗ trợ cả PATCH và POST)
router.patch("/cancel/:id", authMiddleware.verifyToken, bookingController.cancelBooking);
router.post("/cancel/:id", authMiddleware.verifyToken, bookingController.cancelBooking);

// Xem chi tiết một booking theo ID
router.get("/:id", authMiddleware.verifyToken, bookingController.getBookingById);

module.exports = router;
