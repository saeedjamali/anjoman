import connectToDB from "@/utils/db";
import regionModel from "@/models/base/Region";
import { authAdmin, authManagerApi } from "@/utils/authenticateMe";

export async function GET(req, { params }) {
  if (!(await authManagerApi())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });

}
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }
    const region = await regionModel.find();
    // const unitSelected = units?.slice(start, end);
    const len = region.length;
    return Response.json({
      message: "اطلاعات با موفقیت دریافت شد",
      status: 201,
      region,
      len,
    });
  } catch (error) { }
}
