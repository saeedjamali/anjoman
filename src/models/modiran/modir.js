import mongoose from "mongoose";
import user from "@/models/base/User";
import modirUnit from "@/models/modiran/modirUnit";
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
    comment: {
      type: String
    }
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

const Modir = mongoose.models?.Modir || mongoose.model("Modir", schema);
export default Modir;
