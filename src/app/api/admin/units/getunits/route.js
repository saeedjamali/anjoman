import connectToDB from "@/utils/db";
import unitModel from "@/models/base/Unit";
import { authAdminApi } from "@/utils/authenticateMe";

export async function GET(req) {
  if (!(await authAdminApi())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }
    const units = await unitModel.find();
    const len = units.length;
    return Response.json({
      message: "واحد های سازمانی با موفقیت دریافت شد",
      status: 201,
      units,
      len,
    });
  } catch (error) {
    return Response.json({ message: "خطای ناشناخته", status: 500 });
  }
}
