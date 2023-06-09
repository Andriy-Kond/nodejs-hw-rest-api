require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');

mongoose.set('strictQuery', true);
const { DB_HOST, PORT = 3000 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => app.listen(PORT))
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });
