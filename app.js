const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./db/mongoDb');
const authRoutes = require('./api/v1/auth');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
connectDB();

app.use('/api/v1', authRoutes);
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))