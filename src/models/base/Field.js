//? جدول رشته های تحصیلی

import mongoose from "mongoose";
const fieldSchema = mongoose.Schema(
  {
    code: {
      type: Number,
      require: true,
    },
    name: {
      type: String,
      required: true,
    },
  }
);

const Field = mongoose.models?.Field || mongoose.model("Field", fieldSchema);
export default Field;
export {fieldSchema}