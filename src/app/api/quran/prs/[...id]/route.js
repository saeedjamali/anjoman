import connectToDB from "@/utils/db";
import quranModel from "@/models/quran/Quran";
import {
  valiadteMeliCode,
  valiadtePrsCode,
  valiadteSchoolCode,
} from "@/utils/auth";

export async function GET(req, { params }) {
  // return Response.json({ message: "دسترسی غیر مجاز", status: 500 });

  const [prs, identifier, phone] = params.id;

  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    if (!valiadtePrsCode(prs)) {
      return Response.json({
        message: "کد پرسنلی ارسالی نامعتبر می باشد",
        status: 401,
      });
    }
    if (!valiadteMeliCode(identifier)) {
      return Response.json({
        message: "کد ملی ارسالی نامعتبر می باشد",
        status: 401,
      });
    }
    // const founded = await quranModel.find().skip(0).limit(20);

    const foundedPrs = await quranModel.findOne({ prs });
    console.log(foundedPrs);
    if (!foundedPrs) {
      return Response.json({
        message: "کد پرسنلی یافت نشد",
        status: 401,
      });
    }

    if (foundedPrs?.identifier != identifier) {
      return Response.json({
        message: "کد پرسنلی و کد ملی مطابقت ندارد",
        status: 401,
      });
    }
    if (foundedPrs && foundedPrs.phone && foundedPrs.phone != phone) {
      let phoneSlice =
        "" +
        foundedPrs.phone.slice(8, 11) +
        "****" +
        foundedPrs.phone.slice(0, 4) +
        "";
      return Response.json({
        message: `برای این کد پرسنلی قبلا با شماره همراه ${phoneSlice} ابلاغ دریافت شده است`,
        status: 401,
      });
    }
    const foundedPhone = await quranModel.findOne({ phone });

    if (foundedPhone && foundedPhone.prs != prs) {
      return Response.json({
        message: "این شماره همراه قبلا برای فرد دیگری استفاده شده است.",
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
