import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    code: {
      //کد اختصاصی شرکت
      type: Number,
      required: true,
      // index: true
    },

    owner: {
      // نام مالک
      type: String,
      required: true,
    },
    phone: {
      //شماره همراه مالک
      type: String,
      required: true,
    },
    ownerCode: {
      //کد ملی مالک
      type: String,
      required: true,
    },
    name: {
      // نام شرکت
      type: String,
      required: true,
    },
    address: {
      //آدرس اختصاصی شرکت
      type: String,
      required: true,
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
    isActive: {
      type: Number,
      default: 1,
      // 0 : در حال بررسی
      // 1 : تایید
      // 2 : رد
    },
    year: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      default: 0,
    },
    isUsed: {
      type: Number,
      required: false,
      default: 0,
    },
    creator: {
      //? شرکت هایی که مدیر مدرسه تعریف میکنه ایدی مدیر اینجا ثبت میشود
      type: String,
      required: false,
    },
    // regions: { //مناطق تحت پوشش
    //     type: [String],
    //     default: [],
    //     required: false,
    // },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.models?.Company || mongoose.model("Company", schema);
export default Company;
