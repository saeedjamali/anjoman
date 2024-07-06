import mongoose from "mongoose";
const schema = mongoose.Schema({
    resCode: {
        type: Number,
        require: true,
    },
    orderId: {    //? شماره سفارش : بروز شده در جدول مشتری
        type: Number,
        require: true,
    },
    amount: {
        type: Number,
        require: true,
    },
    description: { //? شرح نتیجه تراکنش
        type: String,
        required: true,
    },
    retrivalRefNo: {  //? شماره مرجع تراکنش
        type: String,
        required: true,
    },
    systemTraceNo: { //? شماره پیگیری
        type: String,
        required: true,
    },

});

const Payment =
    mongoose.models?.Payment || mongoose.model("Payment", schema);
export default Payment;
export { schema };
