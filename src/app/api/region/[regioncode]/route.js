import connectToDB from "@/utils/db";
import regionModel from "@/models/base/Region";
import { valiadteRegionCode, valiadteSchoolCode } from "@/utils/auth";
let ObjectId = require("mongoose").Types.ObjectId;

export async function GET(req, { params }) {
  const regionCode = params.regioncode;
  // if (!(await authenticateMe())) {
  //   return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  // }
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    if (!valiadteRegionCode(regionCode)) {
      return Response.json({
        message: "کد منطقه نامعتبر می باشد",
        status: 401,
      });
    }

    const foundedRegion = await regionModel.findOne({
      regionCode,
    });

    if (!foundedRegion) {
      return Response.json({
        message: "کد منطقه یافت نشد",
        status: 401,
      });
    }

    return Response.json({
      message: "کد منطقه یافت شد",
      status: 200,
      region: foundedRegion,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "Unknown error !!!" });
  }
}
