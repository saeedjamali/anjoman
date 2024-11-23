import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    meliCodee: {
      type: String,
      required: false,
    },
    prsCode: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    family: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    regCode: {
      type: String,
      required: true,
    },
    regName: {
      type: String,
      required: true,
    },
    status: {
      //? status Occuption
      // 1 : شاغل
      // 2 : بازنشسته
      type: Number,
      default: 0,
    },
    role: { //999 admin
      type: Number,
      default: 0,
    },
    result: { 
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.models?.Prs || mongoose.model("Prs", schema);
export default model;
