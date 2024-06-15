import mongoose from "mongoose";
import modir from "@/models/modiran/modir"
import { unitSchema } from "@/models/base/Unit"
import modirUnit from "@/models/modiran/modirUnit"

const { Schema } = mongoose;
// mongoose.Promise = global.Promise;

const schema = mongoose.Schema({

    Modir: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Modir"
    },
    User: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    Unit: {
        type: unitSchema,
        required: true,
    }
    ,
    isActive: {
        type: Number,
        default: 0,
        // 0 : در حال بررسی 
        // 1 : تایید
        // 2 : رد 

    }, 
    defaultUnit: {
        type: String,
        default: false,
    },

    comment: {
        type: String,
    }
}, {
    timestamps: true,
}
)


const ModirUnit = mongoose.models?.ModirUnit || mongoose.model("ModirUnit", schema);
export default ModirUnit