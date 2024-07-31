import connectToDB from "@/utils/db";
import { authAdminApi, authenticateLecturer } from "@/utils/authenticateMe";
import lecturerModel from "@/models/lecturer/lecturer";

export async function PUT(req, { params }) {
  if (!(await authenticateLecturer())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }

  try {
    const formData = await req.formData();
    const isProt = formData.get("isProt");
    const commentProt = formData.get("commentprot");
    const id = formData.get("id");
    let updateLecturer = null;
    console.log(formData);
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    if (isProt) {
      updateLecturer = await lecturerModel.findOneAndUpdate(
        { _id: id },
        {
          commentProt,
          isProt: true,
          status: 7,
        }
      );
    }

    // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
    if (!updateLecturer) {
      return Response.json({
        message: "برای این مدرس اطلاعاتی یافت نشد",
        status: 401,
      });
    }

    return Response.json({
      message: "اعتراض شما با موفقیت ثبت شد",
      status: 201,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "خطای ناشناخته !!!" });
  }
}
