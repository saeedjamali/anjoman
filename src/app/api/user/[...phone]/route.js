import connectToDB from "@/utils/db";
import userModel from "@/models/base/User";
import modirUnitModel from "@/models/modiran/modirUnit";
import { valiadtePhone } from "@/utils/auth";
export async function GET(req, { params }) {
  const phone = params.phone[0];
  const role = params.phone[1];
  const identifier = params.phone[2];
  // if (!(await authenticateMe())) {
  //   return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  // }
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    if (!valiadtePhone(phone)) {
      return Response.json({
        message: "شماره همراه نامعتبر می باشد",
        status: 401,
      });
    }

    const foundedUser = await userModel.findOne({
      $and: [{ phone }, { role }],
    });
    // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
    if (foundedUser) {
      return Response.json({
        message: "کاربری با این شماره/نقش قبلا ثبت نام نموده است",
        status: 401,
      });
    }

    if (role == "modir") {
      const isModirUnit = await modirUnitModel.findOne({
        $and: [{ "Unit.schoolCode": identifier }, { isActive: 2 }],
      });
      if (isModirUnit) {
        return Response.json(
          { message: "این واحد سازمانی مدیر فعال دارد" },
          { status: 422 }
        );
      }
    }

    return Response.json({
      message: "کاربری با این شماره یافت نشد",
      status: 200,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "Unknown error !!!" });
  }
}
