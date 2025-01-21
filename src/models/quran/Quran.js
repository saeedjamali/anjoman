import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
    },
    prs: {
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
      required: false,
    },
    region: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    schoolname: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      //? status received
      // 1 : دریافت تشویقی
      // 2 :
      type: Number,
      default: 0,
    },
    role: {
      //999 admin
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

const model = mongoose.models?.Quran || mongoose.model("Quran", schema);
export default model;
