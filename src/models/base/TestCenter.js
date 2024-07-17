//? جدول مراکر آزمون

import mongoose from "mongoose";
const testCenterSchema = mongoose.Schema({
  code: {
    type: Number,
    require: true,
  },
  gender: {
    //? 1 : male    ----- 2: female
    type: Number,
    require: true,
  },
  type: {
    //? نوع مرکز آزمون
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  isUsed: {
    type: Number,
    required: false,
  },
});

const TestCenter =
  mongoose.models?.TestCenter || mongoose.model("TestCenter", testCenterSchema);
export default TestCenter;
export { testCenterSchema };
