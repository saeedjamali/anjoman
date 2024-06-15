import connectToDB from "@/utils/db";
import modirUnitModel from "@/models/modiran/modirUnit";
import { authAdmin, authAdminApi } from "@/utils/authenticateMe";

export async function GET(req, { params }) {
  
  if (!(await authAdminApi())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });

  }
  const level = params.regionlevel[0];
  const regionCode = params.regionlevel[1];
  const provinceCode = params.regionlevel[2];
  let mus = [];
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    if (level == 1) {
      //? access region
      mus = await modirUnitModel
        .find({ "Unit.regionCode": regionCode })
        .populate({
          path: "Modir",
        });
    }
    if (level == 2) {
      //? access province
      mus = await modirUnitModel
        .find({ "Unit.provinceCode": provinceCode })
        .populate({
          path: "Modir",
        });
    }
    if (level == 3 || level == 999) {
      //?global access
      mus = await modirUnitModel.find().populate({
        path: "Modir",
      });
    }
    const len = mus.length;
    if (len == 0) {
      return Response.json({
        message: ' مدیر - واحد  سازمانی یافت نشد',
        status: 202,
        mus,
        len,
      });
    }
    return Response.json({
      message: `${len} مدیر - واحد  سازمانی با موفقیت دریافت شد`,
      status: 201,
      mus,
      len,
    });
  } catch (error) {
    console.log("error ---------->", error);
    return Response.json({ message: "خطای ناشناخته", status: 500 });
  }
}
