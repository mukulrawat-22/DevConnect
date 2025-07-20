const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://mukulrawat0677:PGK4YCRZPbJxugdk@namastebackend.vzd4k.mongodb.net/devtinder"
  );
};

module.exports = connectDb;