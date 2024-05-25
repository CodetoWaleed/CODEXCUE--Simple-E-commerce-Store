import mongoose from "mongoose";

const connectDb = (handler) => async (req, res) => {
  // Set the bufferMaxTimeMS setting to 20000ms.
  mongoose.connection.bufferMaxTimeMS = 20000;

  if (mongoose.connections[0].readyState) {
    return handler(req, res);
  }
  await mongoose.connect(process.env.MONGO_URI);
  return handler(req, res);
};

export default connectDb;
