const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  MONGODB_URL: process.env.MONGODBURL,
  JWT_STR: process.env.JWT_STR,
};
