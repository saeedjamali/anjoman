import connectToDB from "@/utils/db";
import unitModel from "@/models/base/Unit"
import { authAdmin } from "@/utils/authenticateMe";
export async function POST(req) {
    const units = await req.json();
    if (!(await authAdmin())) {
        return Response.json({ message: "دسترسی غیر مجاز", status: 500 });

    }
    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }

        let updated = 0, added = 0;
        await Promise.all(await units.map(async (unit) => {
            const { schoolCode,
                provinceName,
                provinceCode,
                regionCode,
                regionName,
                schoolName,
                schoolgeo,
                schoolType,
                schoolTypeCode,
                schoolgender,
                schoolgenderCode,
                schoolGrade,
                schoolGradeCode,
                schoolClass,
                female,
                male,
                all,
                lng,
                lat,
                year } = unit;
            const unitUpdated = await unitModel.findOneAndUpdate({ $and: [{ schoolCode }, { year }] }, { $set: { female, male, lng, lat } });
            if (unitUpdated) {
                updated = updated + 1;
            } else {
                const unitCreated = await unitModel.create({
                    schoolCode,
                    provinceName,
                    provinceCode,
                    regionCode,
                    regionName,
                    schoolName,
                    schoolgeo,
                    schoolType,
                    schoolTypeCode,
                    schoolgender,
                    schoolgenderCode,
                    schoolGrade,
                    schoolGradeCode,
                    schoolClass,
                    female,
                    male,
                    all,
                    lng,
                    lat,
                    year
                });
                added = added + 1;
            }

        }))

        return Response.json({ message: `${added} واحد سازمانی اضافه و ${updated} بروز شد`, status: 201 });

    } catch (error) {
        console.log("Error ->", error)
        return Response.json({ message: "Unknown error !!!" });
    }


}