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
  console.log("lc ln----------->", lecturers.length);
  let allLecturer = lecturers[0] == "a" ? true : false;
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    if (allLecturer) {
        return Response.json({
            message: "برای جلوگیری از بروز خطا،امکان انتخاب  کل موارد غیر فعال می باشد.",
            status: 401,
          });
    //   console.log("Yes");
    //   await Promise.all(
    //     await lecturers.map(async (lc) => {
    //       const lecturerUpdated = await lecturerModel.findOneAndUpdate(
    //         { status: 1 },
    //         {
    //           $set: {
    //             testCenter,
    //           },
    //         }
    //       );
    //     })
    //   );
    //   return Response.json({
    //     message: "اطلاعات مرکز آزمون کل افراد بروز شد",
    //     status: 201,
    //   });
    }

    let lecturerUpdated = {};
    await Promise.all(
      await lecturers.map(async (lc) => {
        lecturerUpdated = await lecturerModel.findOneAndUpdate(
          { $and: [{ _id: lc }, { status: 1 }] },
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
