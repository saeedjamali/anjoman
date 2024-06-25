import connectToDB from "@/utils/db";
import { authAdminApi } from "@/utils/authenticateMe";
import lecturerModel from "@/models/lecturer/lecturer";
export async function DELETE(req, { params }) {
  if (!(await authAdminApi())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }

  const lecturerId = params.lecturerid;
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    //اطلاعات واحد سازمانی حذف نمی شود/ بلکه وضعیت به لغو تغییر میکند
    const deletedLecturer = await lecturerModel.findOneAndUpdate(
      { _id: lecturerId },
      { isRemoved: true }
    );

    // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
    if (!deletedLecturer) {
      return Response.json({ message: "خطا در حذف ثبت نام", status: 401 });
    }

    return Response.json({
      message: " وضعیت ثبت نام به حذف شده تغییرکرد",
      status: 201,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "خطای ناشناخته!!!" });
  }
}
