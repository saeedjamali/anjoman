//? جدول نمرات

import mongoose from "mongoose";
const schema = mongoose.Schema({
  result: {
    type: Number,
    require: true,
  },
  name: {
    type: String,
    required: true,
  },
  family: {
    type: String,
    required: true,
  },
  codeMeli: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  birthDay: {
    type: String,
    required: true,
  },
  schoolName: {
    type: String,
    required: true,
  },
  regionName: {
    type: String,
    required: true,
  },
});

const Score = mongoose.models?.Score || mongoose.model("Score", schema);
export default Score;
export { schema };
