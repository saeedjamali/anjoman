import connectToDB from "@/utils/db";
import userModel from "@/models/base/User";
import { authAdminApi } from "@/utils/authenticateMe";

export async function PUT(req, { params }) {
  const userId = params.userId[0];
  if (!(await authAdminApi())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }
  const body = await req.json();
  const { role, isActive, comment, isBan } = body;

  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    const updateUser = await userModel.findOneAndUpdate(
      { _id: userId },
      {
        
        isActive,
        comment,
        isBan,
      }
    );

    // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
    if (!updateUser) {
      return Response.json({
        message: "کاربری با این مشخصات یافت نشد",
        status: 401,
      });
    }

    return Response.json({
      message: " اطلاعات کاربر با موفقیت بروز شد",
      status: 201,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "خطای ناشناخته !!!" });
  }
}
