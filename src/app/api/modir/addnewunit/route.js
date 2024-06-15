import connectToDB from "@/utils/db";
import unit from "@/models/base/Unit";
import modirUnitModel from "@/models/modiran/modirUnit"
import { valiadteSchoolCode } from "@/utils/auth";
import { authenticateMe } from "@/utils/authenticateMe";
let ObjectId = require("mongoose").Types.ObjectId;

export async function POST(req, { params }) {
    if (!(await authenticateMe())) {
        return Response.json({ message: "دسترسی غیر مجاز", status: 500 });

    }
    const body = await req.json();
    const { unitCode, year, modirId, userId } = body;

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
                message: "کد واحد سازمانی در سال تحصیلی جاری یافت نشد",
                status: 401,
            });
        }


        const newModirUnit = await modirUnitModel.create({
            Unit: foundedUnit,
            Modir: modirId,
            User: userId

        });

        if (!newModirUnit) {
            return Response.json({ message: "خطا در افزودن واحد سازمانی", status: 401 })
        }
        return Response.json({ message: "واحد سازمانی با موفقیت افزوده شد", status: 200, unit: foundedUnit })


    } catch (error) {
        console.log("Error ->", error);
        return Response.json({ message: "Unknown error !!!" });
    }
}
