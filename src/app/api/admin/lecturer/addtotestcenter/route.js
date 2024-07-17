import connectToDB from "@/utils/db";
import lecturerModel from "@/models/lecturer/lecturer";
import {
  authAdmin,
  authAdminApi,
  authManagerApi,
} from "@/utils/authenticateMe";
export async function POST(req) {
  if (!(await authAdminApi())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }
  let { lecturers, testCenter } = await req.json();
  let allLecturer = lecturers[0] == "a" ? true : false;
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    if (allLecturer) {
        console.log("Yes")
      await Promise.all(
        await lecturers.map(async (lc) => {
          const lecturerUpdated = await lecturerModel.findOneAndUpdate({
            $set: {
              testCenter,
            },
          });
        })
      );
      return Response.json({
        message: "اطلاعات مرکز آزمون کل افراد بروز شد",
        status: 201,
      });
    }

    let lecturerUpdated = {};
    await Promise.all(
      await lecturers.map(async (lc) => {
        lecturerUpdated = await lecturerModel.findOneAndUpdate(
          { _id: lc },
          {
            $set: {
              testCenter,
            },
          }
        );
      })
    );
    if (lecturerUpdated) {
      return Response.json({
        message: "اطلاعات مرکز آزمون  بروز شد",
        status: 201,
      });
    }
    return Response.json({
      message: "خطا در بروزرسانی مراکز آزمون",
      status: 401,
    });
  } catch (error) {
    return Response.json({ message: "خطای ناشناخته", status: 500 });
  }
}
