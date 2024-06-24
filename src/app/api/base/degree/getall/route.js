import DegreeModel from "@/models/base/Degree";
import { degree } from "@/utils/constants";
import connectToDB from "@/utils/db";

export async function GET(req, { params }) {
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }
    const degrees = await DegreeModel.find({}, "-createdAt -updatedAt");

    if (!degrees) {
      return Response.json({
        message: "مدرک تحصیلی در جدول یافت نشد",
        status: 401,
        degrees,
      });
    }
    return Response.json({
      message: "مدرک تحصیلی با موفقیت دریافت شد",
      status: 200,
      degrees,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "Unknown error !!!" });
  }
}
