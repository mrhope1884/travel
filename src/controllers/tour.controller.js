const Tour = require("../models/tour.model");

// API 1: Tạo tour mới (Admin nhập hàng)
module.exports.createTour = async (req, res, next) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: "success",
            message: "🎉 Tạo tour du lịch mới thành công!",
            data: newTour
        });
    } catch (error) {
        next(error); // Đẩy lỗi về error.middleware.js gánh giúp
    }
};

// API 2: Lấy tất cả tour (Khách xem hàng)
module.exports.getAllTours = async (req, res, next) => {
    try {

        const {query, page, limit, minPrice, maxPrice} = req.query; // Lấy query, page, và limit từ URL     
        let filter = {
            isDeleted: false // Chỉ lấy những tour chưa bị xóa
        };

        const conditions = [];

        // Điều kiện còn chỗ trống
        conditions.push({ 
            $or: [
                { maxGroupSize: { $gt: 0 } }, //lương khách tối đa lớn hơn 0
                { maxGroupSize: { $exists: false } }, //
                { maxGroupSize: null }
            ]
        });

        if (query) { //
            conditions.push({
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } }
                ]
            });
        }

        if (conditions.length > 0) {
            filter.$and = conditions; // gộp điểu kiện với AND
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) {
                filter.price.$gte = parseFloat(minPrice);
            }
            if (maxPrice) {
                filter.price.$lte = parseFloat(maxPrice);
            }
        }

        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 9;
        const skip = (pageNumber - 1) * limitNumber;

        const total = await Tour.countDocuments(filter);
        const tours = await Tour.find(filter).skip(skip).limit(limitNumber);

        res.status(200).json({
            status: "success",
            total,
            totalPages: Math.ceil(total / limitNumber),
            currentPage: pageNumber,
            results: tours.length,
            data: tours
        });
    } catch (error) {
        next(error);
    }
};

// API 3: Cập nhật thông tin tour (Admin chỉnh sửa hàng)
module.exports.updateTour = async (req, res, next) => {
    try {
        const tourId = req.params.id;
        const updatedTour = await Tour.findByIdAndUpdate(tourId, req.body, { new: true, runValidators: true });

        if (!updatedTour) {
            return res.status(404).json({ message: "❌ Tour không tồn tại!" });
        }

        res.status(200).json({
            status: "success",
            message: "🎉 Cập nhật thông tin tour thành công!",
            data: updatedTour
        });
    } catch (error) {
        next(error);
    }
};

// API 4: Xóa tour (Admin xóa hàng)
module.exports.deleteTour = async (req, res, next) => {
    try {
        const tourId = req.params.id;
        const deletedTour = await Tour.findByIdAndUpdate(tourId, { isDeleted: true, deletedAt: new Date() }, { new: true });

        if (!deletedTour) {
            return res.status(404).json({ message: "❌ Tour không tồn tại!" });
        }

        res.status(200).json({
            status: "success",
            message: "🎉 Xóa tour thành công!",
            data: deletedTour
        });
    } catch (error) {
        next(error);
    }
};

// API 5: Lấy danh sách tour trong thùng rác (Admin)
module.exports.getTrashTours = async (req, res, next) => {
    try {
        const trashTours = await Tour.find({ isDeleted: true }).sort({ deletedAt: -1 });
        res.status(200).json({
            status: "success",
            results: trashTours.length,
            data: trashTours
        });
    } catch (error) {
        next(error);
    }
};

// API 6: Khôi phục tour từ thùng rác (Admin)
module.exports.restoreTour = async (req, res, next) => {
    try {
        const tourId = req.params.id;
        const restoredTour = await Tour.findByIdAndUpdate(
            tourId,
            { isDeleted: false, deletedAt: null },
            { new: true }
        );

        if (!restoredTour) {
            return res.status(404).json({ message: "❌ Tour không tồn tại trong thùng rác!" });
        }

        res.status(200).json({
            status: "success",
            message: "🎉 Khôi phục tour thành công!",
            data: restoredTour
        });
    } catch (error) {
        next(error);
    }
};

// API 7: Xóa vĩnh viễn tour khỏi Database (Admin)
module.exports.destroyTour = async (req, res, next) => {
    try {
        const tourId = req.params.id;
        const destroyedTour = await Tour.findByIdAndDelete(tourId);

        if (!destroyedTour) {
            return res.status(404).json({ message: "❌ Tour không tồn tại!" });
        }

        res.status(200).json({
            status: "success",
            message: "🎉 Đã xóa vĩnh viễn tour khỏi hệ thống!",
            data: null
        });
    } catch (error) {
        next(error);
    }
};

//