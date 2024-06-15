import mongoose from "mongoose";
import user from "@/models/base/User";
import modir from "@/models/modiran/modir";
import company from "@/models/company/company";
import { unitSchema } from "@/models/base/Unit"
import { pricelistSchema } from "@/models/company/pricelist"

const schema = mongoose.Schema(
  {
    code: {
      type: Number,
      default: () => Date.now(),
      immutable: false
    },
    imageContractList: {
      type: [String],
      default: [],
      required: false,
    },
    imageFormDressList: {
      type: [String],
      default: [],
      required: false,
    },
    year: {
      type: String,
      default: "",
      required: true
    },
    address: {
      type: String,
      default: "",
      required: false

    },
    lng: {
      type: String,
      default: "59.60649396574567",
      required: false,
    },
    lat: {
      type: String,
      default: "36.29779692242873",
      required: false,
    },
    Unit: {
      type: unitSchema,
      required: true,
    },
    modir: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Modir",
    },
    company: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "Company",
    },
    Pricelists: {
      type: [pricelistSchema],
      required: false,
    },
    isConfirm: {
      type: Number,
      default: 0,
      // 0 : در حال بررسی
      // 1 : تایید
      // 2 : رد
      // 10 : فاقد قرارداد
    },
    description: {
      type: String,
      default: ""
    },
    limited: {
      type: Number,
      default: 1
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

const Contract =
  mongoose.models?.Contract || mongoose.model("Contract", schema);
export default Contract;
