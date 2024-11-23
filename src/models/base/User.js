import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    role: { 
      //? modir - admin - lecturer - parent -sherkat - user
      type: String,
      default: "USER",
    },
    identifier: {
      type: String,
      required: true,
    },
    profile: {
      type: [String],
      default: [],
      required: false,
    },
    refreshToken: {
      type: String,
    },
    isActive: {
      type: Number,
      default: 0,
      // 0 : در حال بررسی
      // 1 : تایید
      // 2 : رد
    },
    comment: {
      type: String,
    },
    isBan: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.models?.User || mongoose.model("User", schema);
export default model;
