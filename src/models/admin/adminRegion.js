import mongoose from "mongoose";
import user from "@/models/base/User";
import { regionSchema } from "@/models/base/Region";
const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
      length: 11,
    },
    prsCode: {
      type: String,
      required: false,
      length: 8,
    },
    meliCode: {
      type: String,
      required: false,
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isActive: {
      type: Number,
      default: 0,
      // 0 : در حال بررسی
      // 1 : تایید
      // 2 : رد
    },
    Region: {
      type: regionSchema,
      required: true,
    },
    level: {
      type: Number,
      required: true,
      default: 1, //? 1: region   2: province  3: global  999: poweruser  11:sherkat
      length: 1,
    },
    comment: {
      type: String,
    },
    post: {
      type: String,
    },
    // modirUnit: {
    //     type: mongoose.Types.ObjectId,
    //     required: false,
    //     ref: "ModirUnit"
    // },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.models?.Admin || mongoose.model("Admin", schema);
export default Admin;
