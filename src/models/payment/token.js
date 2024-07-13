import mongoose from "mongoose";
const schema = mongoose.Schema({
   
    orderId: {    //? شماره سفارش : بروز شده در جدول مشتری
        type: Number,
        require: true,
    },
    token: {
        type: String,
        require: true,
    },
    description: { //? شرح نتیجه تراکنش
        type: String,
        required: false,
    },
   

},
    {
        timestamps: true,
    });

const Token =
    mongoose.models?.Token || mongoose.model("Token", schema);
export default Token;
export { schema };
