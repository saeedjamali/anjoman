//? جدول استان ها

import mongoose from "mongoose";
const provinceSchema = mongoose.Schema(
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

const Province = mongoose.models?.Province || mongoose.model("Province", provinceSchema);
export default Province;
export {provinceSchema}
