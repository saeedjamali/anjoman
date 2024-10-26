import connectToDB from "@/utils/db";
import prsModel from "@/models/bime/Prs";
import { valiadtePrsCode, valiadteSchoolCode } from "@/utils/auth";

export async function GET(req, { params }) {
  // if (!(await authenticateMe())) {
  //   return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  // }
  const prsCode = params.id;

  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    if (!valiadtePrsCode(prsCode)) {
      return Response.json({
        message: "کد پرسنلی ارسالی نامعتبر می باشد",
        status: 401,
      });
    }

    const foundedPrs = await prsModel.findOne({ prsCode });
   
    if (!foundedPrs) {
      return Response.json({
        message: "کد پرسنلی یافت نشد",
        status: 401,
      });
    }

    return Response.json({
      message: "کد پرسنلی یافت شد",
      status: 200,
      prs: foundedPrs,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "Unknown error !!!" });
  }
}
