//? جدول مدرک تحصیلی

import mongoose from "mongoose";
const degreeSchema = mongoose.Schema({
  code: {
    type: Number,
    require: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Degree =
  mongoose.models?.Degree || mongoose.model("Degree", degreeSchema);
export default Degree;
export { degreeSchema };
