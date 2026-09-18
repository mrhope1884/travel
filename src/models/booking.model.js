const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tour",
        required: [true, "Booking phải thuộc về một tour nhất định!"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Booking phải thuộc về một người dùng nhất định!"]
    },
    price: {
        type: Number,
        required: [true, "Booking phải có giá tiền!"]
    },
    numBookedSeats: {
        type: Number,
        required: [true, "Booking phải có số lượng ghế đã đặt!"],
        min: [1, "Số lượng ghế đã đặt phải lớn hơn 0!"]
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'],
        default: 'confirmed'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Booking", bookingSchema, "bookings");