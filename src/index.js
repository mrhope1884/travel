const express = require('express');
const cors = require('cors');
const router = require('./routers/auth.route');
const tourRouter = require('./routers/tour.route');
const bookingRouter = require('./routers/booking.route');
const errorMiddleware = require('./middlewares/error.middleware'); 

require('dotenv').config()
const database = require('./config/db');

const app = express()
const port = process.env.PORT || 5000

app.use(express.json());
app.use(cors());
app.use('/api/auth', router);
app.use('/api/tours', tourRouter);
app.use('/api/bookings', bookingRouter);

app.use(errorMiddleware); 

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Tạo hàm async để quản lý luồng khởi động ứng dụng
async function start() {
  // 1. Chờ kết nối Database thành công
  await database.connect();

  // 2. Sau đó mới mở cổng lắng nghe HTTP Request
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

// Gọi hàm thực thi
start();
