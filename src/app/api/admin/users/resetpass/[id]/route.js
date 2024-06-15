import userModel from "@/models/base/User";
import connectToDB from "@/utils/db";
import { hashPassword } from "@/utils/auth";
import { authAdminApi } from "@/utils/authenticateMe";

export async function PUT(req, { params }) {
  if (!(await authAdminApi())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }
  const id = params.id;
  const resetPass = "a123456789";
  try {
    const { isConnected } = await connectToDB();
    if (!isConnected) {
      return Response.json({
        message: "خطای عدم اتصال به پایگاه اطلاعاتی",
        status: 500,
      });
    }

    const userFounded = await userModel.findOne({ _id: id });
    if (!userFounded) {
      return Response.json({ message: "چنین کاربری یافت نشد", status: 401 });
    }

    const newHashPassword = await hashPassword(resetPass);
    const user = await userModel.findOneAndUpdate(
      { _id: id },
      { password: newHashPassword }
    );

    return Response.json({
      message: "رمز با موفقیت ریست شد",
      status: 201,
      user,
    });
  } catch (error) {
    console.log("Error--->", error);
    return false;
  }
}
