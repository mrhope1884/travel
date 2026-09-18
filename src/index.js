const express = require('express');
const cors = require('cors');
const router = require('./routers/auth.route');
const tourRouter = require('./routers/tour.route');
const bookingRouter = require('./routers/booking.route');
const errorMiddleware = require('./middlewares/error.middleware'); // 🔥 GỌI PHỄU LỖI VÀO ĐÂY

require('dotenv').config()
const database = require('./config/db');

database.connect();

const app = express()
const port = process.env.PORT || 5000

app.use(express.json());
app.use(cors());
app.use('/api/auth', router);
app.use('/api/tours', tourRouter);
app.use('/api/bookings', bookingRouter);

app.use(errorMiddleware); // 🔥 GỌI PHỄU LỖI VÀO ĐÂY

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})