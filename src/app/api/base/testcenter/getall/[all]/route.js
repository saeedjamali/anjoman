import TestCenterModel from "@/models/base/TestCenter";
import connectToDB from "@/utils/db";

export async function GET(req, { params }) {
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }
    const testCenter = await TestCenterModel.find({}, "-createdAt -updatedAt");

    if (!testCenter) {
      return Response.json({
        message: "مراکز آزمون در جدول یافت نشد",
        status: 401,
        testCenter,
      });
    }
    return Response.json({
      message: "مراکز آزمون با موفقیت دریافت شد",
      status: 200,
      testCenter,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "Unknown error !!!" });
  }
}
