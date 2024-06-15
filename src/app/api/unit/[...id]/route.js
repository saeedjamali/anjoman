import connectToDB from "@/utils/db";
import unit from "@/models/base/Unit";
import { valiadteSchoolCode } from "@/utils/auth";
let ObjectId = require("mongoose").Types.ObjectId;

export async function GET(req, { params }) {

  // if (!(await authenticateMe())) {
  //   return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  // }
  const unitCode = params.id[0];
  const year = params.id[1];
  const isObjId = ObjectId.isValid(unitCode);
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    if (!isObjId && !valiadteSchoolCode(unitCode)) {
      return Response.json({
        message: "کد واحد سازمانی نامعتبر می باشد",
        status: 401,
        isObjId,
      });
    }

    const foundedUnit = isObjId
      ? await unit.findOne({ $and: [{ _id: unitCode }, { year }] })
      : await unit.findOne({ $and: [{ schoolCode: unitCode }, { year }] });
    if (!foundedUnit) {
      return Response.json({
        message: "کد واحد سازمانی یافت نشد",
        status: 401,
      });
    }

    return Response.json({
      message: "کد واحد سازمانی یافت شد",
      status: 200,
      unit: foundedUnit,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "Unknown error !!!" });
  }
}
