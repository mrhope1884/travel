const Booking = require("../models/booking.model");
const Tour = require("../models/tour.model");
const User = require("../models/user.model");

// Controller để tạo booking mới
module.exports.createBooking = async (req, res, next) => {
    try {
        const { tourId, userId, numBookedSeats } = req.body; 
        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({ message: "❌ Tour không tồn tại!" });
        }

        //Tụ động tính giá tiền dựa trên số lượng ghế đã đặt và giá tiền của tour
        const currentMaxGroupSize = tour.maxGroupSize || 20;
        const price = tour.price * numBookedSeats;
        const availableSeats = currentMaxGroupSize - numBookedSeats;
        if (availableSeats < 0) {
            return res.status(400).json({ message: "❌ Số lượng ghế đã đặt vượt quá số lượng khách tối đa của tour!" });
        }

        const finalUserId = userId || (req.user && req.user.id);
        if (!finalUserId) {
            return res.status(400).json({ message: "❌ Không xác định được người dùng đặt tour!" });
        }

        // Cập nhật số lượng khách tối đa của tour
        tour.maxGroupSize = availableSeats;
        await tour.save();

        const newBooking = await Booking.create({ tour: tourId, user: finalUserId, price, numBookedSeats });
        res.status(201).json({
            message: "🎉 Tạo booking thành công!",
            data: newBooking
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller để lấy tất cả booking
module.exports.getAllBookings = async (req, res, next) => {
    try {
        const query = (req.user && req.user.role === 'admin') ? {} : { user: req.user.id };
        const bookings = await Booking.find(query).populate('tour').populate('user', 'name email role').sort({ createdAt: -1 });
        res.status(200).json({
            message: "🎉 Lấy danh sách booking thành công!",
            data: bookings
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller để lấy booking theo ID
module.exports.getBookingById = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('tour').populate('user', 'name email');
        if (!booking) {
            return res.status(404).json({ message: "❌ Booking không tồn tại hoặc đã bị xóa!" });
        }
        res.status(200).json({
            status: "success",
            message: "🎉 Lấy booking thành công!",
            data: booking
        });
    } catch (error) {
        console.error("[getBookingById ERROR]:", error.message);
        res.status(500).json({ message: "Lỗi Server: " + error.message });
    }
};

// Controller để hủy booking và tự động hoàn lại ghế cho tour
module.exports.cancelBooking = async (req, res, next) => {
    try {
        console.log("👉 [cancelBooking] Nhận lệnh hủy booking ID:", req.params.id);
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "❌ Đơn đặt tour không tồn tại!" });
        }

        // Nếu đã hủy rồi thì thông báo
        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: "⚠️ Đơn đặt tour này đã bị hủy trước đó rồi!" });
        }

        // Cập nhật trạng thái sang cancelled an toàn tuyệt đối
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: 'cancelled' },
            { new: true }
        );

        // Tự động hoàn lại số ghế cho tour một cách an toàn bằng $inc
        const seatsToRefund = Number(booking.numBookedSeats || 1); 
        if (booking.tour) {
            await Tour.findByIdAndUpdate(booking.tour, {
                $inc: { maxGroupSize: seatsToRefund }
            });
            
        }

        res.status(200).json({
            status: "success",
            message: `🎉 Hủy đơn thành công và đã hoàn lại ${seatsToRefund} chỗ ngồi!`,
            data: updatedBooking
        });
    } catch (error) {
        console.error("[cancelBooking ERROR]:", error.message);
        res.status(500).json({ message: "Lỗi Server khi hủy đơn: " + error.message });
    }
};
