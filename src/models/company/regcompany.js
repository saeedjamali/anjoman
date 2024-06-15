import mongoose from "mongoose";
import company from "@/models/company/company";
import region from "@/models/base/Region";

const schema = mongoose.Schema(
    {
        Region: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "Region"
        },


        companies: {
            type: [
                {
                    type: mongoose.Types.ObjectId,
                    ref: "Company",
                },
            ],
        },
        year: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
    }
);

const RegCompany = mongoose.models?.RegCompany || mongoose.model("RegCompany", schema);
export default RegCompany;
