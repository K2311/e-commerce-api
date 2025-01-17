const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./db/mongoDb');
const authRoutes = require('./api/v1/auth');
const adminDashboard = require('./api/v1/admin/dashboard');
const vendorDashboard = require('./api/v1/vendor/dashboard');
const customerDashboard = require('./api/v1/customer/dashboard');
const productRoutes = require('./api/v1/product');
const cartRouters = require('./api/v1/cart');
const orderRoutes = require('./api/v1/order');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
connectDB();
app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/v1', authRoutes);

// routes
app.use('/api/v1/admin', adminDashboard);
app.use('/api/v1/vendor', vendorDashboard);
app.use('/api/v1/customer', customerDashboard);
app.use('/api/v1/product',productRoutes);
app.use('/api/v1/cart',cartRouters);
app.use('/api/v1/order',orderRoutes);


app.listen(port, () => console.log(`Example app listening on port ${port}!`))