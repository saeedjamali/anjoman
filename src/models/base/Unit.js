import mongoose from "mongoose";

const unitSchema = mongoose.Schema(
  {
    provinceName: {
      type: String,
      required: true,
    },
    provinceCode: {
      type: String,
      required: true,
      length: 2,
    },
    regionCode: {
      type: String,
      required: true,
      length: 4,
    },
    regionName: {
      type: String,
      required: true,
    },
    schoolCode: {
      type: String,
      required: true,
      length: 8,
    },
    schoolName: {
      type: String,
      required: true,
    },
    schoolType: {
      type: String,
      required: true,
    },
    schoolGrade: {
      type: String,
      required: true,
    },
    schoolGradeCode: {
      type: String,
      required: true,
    },
    schoolTypeCode: {
      type: String,
      required: true,
    },
    schoolgeo: {
      type: String,
      required: true,
    },
    schoolgender: {
      type: String,
      required: true,
    },
    schoolgenderCode: {
      type: String,
      required: true,
    },
    schoolClass: {
      type: String,
      required: false,
    },
    schoolAddress: {
      type: String,
      required: false,
      default: "",
    },
    female: {
      type: Number,
      required: false,
      default: 0,
    },
    male: {
      type: Number,
      required: false,
      default: 0,
    },
    all: {
      type: String,
      required: false,
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
    year: {
      type: String,
      required: true,
    },
    isModifiedByUser: {
      // این فیلد در صورت تغییر اطلاعات واحد سازمانی توسط مدیر بروز می شود
      type: Boolean,
      default: false,
    },
    isConfirm: {
      type: Number,
      default: 0,
      // 0 : در حال بررسی
      // 1 : تایید
      // 2 : رد
    },
  },
  {
    timestamps: true,
  }
);

//  .virtual("ModirUnit", {
//     ref: "ModirUnit",
//     localField: "_id",
//     foreignField: "Unit"
// });

const Unit = mongoose.models?.Unit || mongoose.model("Unit", unitSchema);
export default Unit;
export { unitSchema };
