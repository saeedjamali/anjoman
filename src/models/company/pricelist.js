import mongoose from "mongoose";

const { Schema } = mongoose;
// mongoose.Promise = global.Promise;

const pricelistSchema = mongoose.Schema(
  {
    code: {
      //کد اختصاصی محصول
      type: Number,
      required: true,
    },
    grade: {
      // مقطع ==>   1: کودکستان ، 2: پیش دبستانی ، 3: ابتدایی ، 4: متوسطه اول ، 5: متوسطه دوم
      type: String,
      required: true,
    },

    gender: {
      // جنسیت  ==> پسر و مرد : 1 ، دختر و زن : 2 ، مختلط : 3
      type: Number,
      required: true,
    },
    type: {
      //نوع مخصول  ==> مثال : سه تیکه سارافونی
      type: String,
      required: true,
    },
    material: {
      //جنس پارچه
      type: String,
      required: true,
    },
    size: {
      // سایز لباس
      type: String,
      required: true,
    },
    group: {
      // برای کنترل تعداد از این فیلد استفاده میشود
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    priceInContract: {
      type: String,
      required: false,
      default: 0,
    },
    year: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const PriceList =
  mongoose.models?.PriceList || mongoose.model("PriceList", pricelistSchema);
export default PriceList;
export { pricelistSchema };
