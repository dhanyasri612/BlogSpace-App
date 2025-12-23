import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!globalThis.__mongoose) {
  globalThis.__mongoose = { conn: null, promise: null };
}

const connectMongo = async () => {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not set");
  }

  if (globalThis.__mongoose.conn) {
    return globalThis.__mongoose.conn;
  }

  if (!globalThis.__mongoose.promise) {
    globalThis.__mongoose.promise = mongoose.connect(MONGO_URI);
  }

  globalThis.__mongoose.conn = await globalThis.__mongoose.promise;
  return globalThis.__mongoose.conn;
};

export default connectMongo;
