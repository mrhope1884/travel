const mongoose = require('mongoose');

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Kết nối Database thành công!");
  } catch (error) {
    console.log("❌ Lỗi kết nối Database:", error);
  }
};