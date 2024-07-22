import connectToDB from "@/utils/db";
import lecturerModel from "@/models/lecturer/lecturer";
import {
  authAdmin,
  authAdminApi,
  authManagerApi,
} from "@/utils/authenticateMe";
export async function POST(req, { params }) {
  // 669b5528056ad7a813c603c6  m
  // 669b5528056ad7a813c603c7  f
  // 669b5528056ad7a813c603c8  f
  if (!(await authAdminApi())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }
  let testCenter = await params.id;
  console.log("testCenter----------->", testCenter);
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    let lecturerUpdated = {};
    if (testCenter) {
      const lecturerFounded = await lecturerModel.find({ testCenter });

      await Promise.all(
        await lecturerFounded.map(async (lc, index) => {
          lecturerUpdated = await lecturerModel.findOneAndUpdate(
            { $and: [{ _id: lc }, { status: 1 }, { payment: 2 }] },
            {
              $set: {
                seatCode: index + 20001,
              },
            }
          );
        })
      );
    }

    if (lecturerUpdated) {
      return Response.json({
        message: "اطلاعات مرکز آزمون  بروز شد",
        status: 201,
      });
    }
    return Response.json({
      message: " شرایط تخصیص مرکز را ندارد",
      status: 401,
    });
  } catch (error) {
    console.log("error from api map test center-->", error);
    return Response.json({ message: "خطای ناشناخته", status: 500 });
  }
}
