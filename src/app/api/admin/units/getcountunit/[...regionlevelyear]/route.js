import unitModel from "@/models/base/Unit";
import { authAdmin, authAdminApi } from "@/utils/authenticateMe";
import connectToDB from "@/utils/db";

export async function GET(req, { params }) {
  if (!(await authAdminApi())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }
  // const regionId = await params.regionid;
  const level = params.regionlevelyear[0];
  const regionCode = params.regionlevelyear[1];
  const provinceCode = params.regionlevelyear[2];
  const year = params.regionlevelyear[3];
  let regionUnits = [];
  // const u = JSON.parse(units);
  try {
    const { isConnected } = await connectToDB();

    if (!isConnected) {
      return Response.json({ message: "عدم ارتباط با پایگاه", status: 501 });
    }

    if (level == 1) {

      regionUnits = await unitModel.find(
        {
          $and: [{ regionCode }, { year }],
        },
        " schoolName schoolGrade schoolCode"
      );
    }
    if (level == 2) {
      regionUnits = await unitModel.find(
        {
          $and: [{ provinceCode }, { year }],
        },
        " schoolName schoolGrade schoolCode"
      );
    }

    if (level == 999 || level == 3) {
      regionUnits = await unitModel.find(
        { year },
        " schoolName schoolGrade schoolCode"
      );
    }

    if (regionUnits.length != 0) {
      return Response.json({
        message: "تعداد واحد های سازمانی منطقه با موفقیت دریافت شد",
        countregionUnit: regionUnits.length,
        regionUnits,
        status: 201,
      });
    }
    return Response.json({
      message: "برای این منطقه واحد سازمانی ثبت نشده است",
      status: 401,
    });
  } catch (error) {
    console.log("Error in api get region unit-->", error);
    return Response.json({ message: "خطای ناشناخته", status: 501 });
  }
}
