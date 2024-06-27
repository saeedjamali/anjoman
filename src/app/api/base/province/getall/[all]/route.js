import ProvinceModel from "@/models/base/Province";
import { province } from "@/utils/constants";
import connectToDB from "@/utils/db";

export async function GET(req, { params }) {
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    const provinces = await ProvinceModel.find({}, "-createdAt -updatedAt");

    if (!provinces) {
      return Response.json({
        message: "استان یافت نشد",
        status: 401
      });
    }
    return Response.json({
      message: "استان ها با موفقیت دریافت شد",
      status: 200,
      provinces,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "Unknown error !!!" });
  }
}
