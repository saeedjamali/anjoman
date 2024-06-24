import mongoose from "mongoose";
import user from "@/models/base/User";
import { provinceSchema } from "@/models/base/Province";
import { regionSchema } from "@/models/base/Region";
import { fieldSchema } from "@/models/base/Field";
import { degreeSchema } from "@/models/base/Degree";

const schema = mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
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
      required: true,
      length: 10,
    },

    occuptionState: {
      //? 1 : شاغل
      //? 2 : بازنشسته
      type: Number,
      required: true,
    },
    organ: {
      //? 1 : آموزش و پرورش
      //? 2 : دانشگاه
      //? 3 : حوزه علمیه
      type: Number,
      required: true,
    },
    isAcademic: {
      type: Boolean,
      required: false,
    },
    typeAcademic: {
      //? 1 : استادیار
      //? 2 : دانشیار
      type: Number,
      required: false,
    },
    //? بارگذاری معرفی نامه
    introDoc: {
      type: [String],
      default: [],
      required: false,
    },
    province: {
      type: provinceSchema,
      required: true,
    },
    Region: {
      type: regionSchema,
      required: false,
    },
    cityName: {
      type: String,
      required: false,
    },
    degree: {
      //? 1 : کارشناسی ارشد
      //? 2 : دکتری
      //? 3 : سطح سه حوزه
      //? 4 : سطح چهار حوزه

      type: degreeSchema,
      required: true,
    },
    field: {
      type: fieldSchema,
      required: true,
    },
    //? بارگذاری تصویر مدرک
    degreeDoc: {
      type: [String],
      default: [],
      required: true,
    },
    isCertificateBefore: {
      type: Boolean,
      required: true,
    },
    //? بارگذاری تصویر گواهی نامه
    certificateDoc: {
      type: [String],
      default: [],
      required: false,
    },
    age: {
      type: Number,
      required: true,
    },
    isAccepted: {
      //? بند 5 : دارای مدرک دکتری در آپ یا هیئت علمی با رتبه استادیار یا دانشیار یا حوزه سطح 4
      type: Boolean,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      //? status == 1  ثبت نام شده
      //? status == 2  قبولی در مضاحبه
      //? status == 3  رد شده
      type: Number,
      required: false,
    },
    payment: {
      //? 0 : نامشخص
      //? 1 : free رایگان
      //? 2 : payment پولی
      type: Number,
      required: false,
    },
    comment: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
  }
);

const Lecturer =
  mongoose.models?.Lecturer || mongoose.model("Lecturer", schema);
export default Lecturer;
