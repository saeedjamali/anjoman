import connectToDB from "@/utils/db";
import regionModel from "@/models/base/Region";
import { valiadteProvinceCode, valiadteRegionCode, valiadteSchoolCode } from "@/utils/auth";
let ObjectId = require("mongoose").Types.ObjectId;

export async function GET(req, { params }) {
    const provinceCode = params.provincecode;
    
    // if (!(await authenticateMe())) {
    //   return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
    // }
    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }

        if (!valiadteProvinceCode(provinceCode)) {
            return Response.json({
                message: "کد استان نامعتبر می باشد",
                status: 401,
            });
        }

        const foundedRegion = await regionModel.find({
            provinceCode,
        });

        if (!foundedRegion) {
            return Response.json({
                message: "کد منطقه یافت نشد",
                status: 401,
            });
        }
        // console.log("foundedRegion-->", foundedRegion)

        return Response.json({
            message: "کد منطقه یافت شد",
            status: 200,
            regions: foundedRegion,
        });
    } catch (error) {
        console.log("Error ->", error);
        return Response.json({ message: "Unknown error !!!" });
    }
}
