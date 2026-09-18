const mongoose = require('mongoose');

module.exports.connect = async () => {
  try {
    // Thêm option serverSelectionTimeoutMS để Mongoose kiên nhẫn đợi kết nối hơn
    const databaseUrl = "mongodb+srv://vuvietquan1884_db_user:vietquan1884@cluster0.v0euzvx.mongodb.net/travel?retryWrites=true&w=majority&appName=Cluster0";

    await mongoose.connect(databaseUrl, {
      serverSelectionTimeoutMS: 30000 
    });
    console.log("✅ Kết nối Database thành công!");
  } catch (error) {
    console.log("❌ Lỗi kết nối Database:", error);
    process.exit(1); // 🔥 BẮT BUỘC: Dừng ứng dụng nếu DB lỗi, không cho chạy tiếp để tránh nghẽn
  }
};
