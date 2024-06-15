import connectToDB from "@/utils/db";
import adminModel from "@/models/admin/adminRegion";
import { authAdmin, authManagerApi } from "@/utils/authenticateMe";

export async function GET(req, { params }) {
  if (!(await authManagerApi())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }
  const level = params.levelisctive[0];
  const isActive = params.levelisctive[1];
  // const regionCode = params.regionlevel[1];
  // const provinceCode = params.regionlevel[2];
  let admins = [];
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    if (isActive == 1 && (level == 3 || level == 999)) {
      //?global access
      admins = await adminModel.find();
    } else {
      return Response.json({
        message: "شما به اطلاعات این قسمت دسترسی ندارید",
        status: 401,
      });
    }

    // const len = admins.length;
    return Response.json({
      message: "با موفقیت دریافت شد",
      status: 201,
      admins,
    });
  } catch (error) {
    console.log("error in get modir --->", error);
    return Response.json({ message: "خطای ناشناخته", status: 500 });
  }
}
