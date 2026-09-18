const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tour.controller");
const authMiddleware = require("../middlewares/auth.middleware"); // Gọi file auth cũ của bạn

// 🔓 Khách vào xem hàng: Không cần đăng nhập
router.get("/", tourController.getAllTours);


// 🔒 Admin nhập thêm hàng: Bắt buộc đi qua 2 trạm gác phân quyền
router.post("/create", 
    authMiddleware.verifyToken, 
    authMiddleware.checkAdmin, 
    tourController.createTour,
);

router.put("/update/:id", 
    authMiddleware.verifyToken, 
    authMiddleware.checkAdmin, 
    tourController.updateTour,
);

router.delete("/delete/:id", 
    authMiddleware.verifyToken, 
    authMiddleware.checkAdmin, 
    tourController.deleteTour,
);

// 🗑️ Admin xem thùng rác
router.get("/trash", 
    authMiddleware.verifyToken, 
    authMiddleware.checkAdmin, 
    tourController.getTrashTours
);

// 🔄 Admin khôi phục tour từ thùng rác
router.patch("/restore/:id", 
    authMiddleware.verifyToken, 
    authMiddleware.checkAdmin, 
    tourController.restoreTour
);

// 💥 Admin xóa vĩnh viễn tour khỏi database
router.delete("/destroy/:id", 
    authMiddleware.verifyToken, 
    authMiddleware.checkAdmin, 
    tourController.destroyTour
);

module.exports = router;


