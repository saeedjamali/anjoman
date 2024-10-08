import connectToDB from "@/utils/db";
import lecturerModel from "@/models/lecturer/lecturer";
import paymentModel from "@/models/payment/payment";
import { authenticateLecturer } from "@/utils/authenticateMe";
let ObjectId = require("mongoose").Types.ObjectId;

export async function GET(req, { params }) {
  if (!(await authenticateLecturer())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }
  const phone = params.phoneyear[0];
  const year = params.phoneyear[1];

  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    const lectureFound = await lecturerModel
      .findOne({
        $and: [{ phone }, { year }, { isRemoved: false }],
      })
      .populate([
        {
          path: "paymentId",
        },
        {
          path: "testCenter",
        },
      ]);

    if (!lectureFound) {
      return Response.json({
        message: "ثبت نامی برای این شماره همراه یافت نشد",
        status: 401,
      });
    }

    return Response.json({
      message: "برای این شماره همراه این موارد یافت شد",
      status: 200,
      lectureFound,
      paymentFounded: lectureFound.paymentId,
      testCenterFounded: lectureFound.testCenter,
    });

    // if (lectureFound.orderId) {
    //   const paymentFounded = await paymentModel.findOne({
    //     orderId: lectureFound.orderId,
    //   });
    //   return Response.json({
    //     message: "برای این شماره همراه این موارد یافت شد",
    //     status: 200,
    //     lectureFound,
    //     paymentFounded,
    //   });
    // }

    // return Response.json({
    //   message: "برای این شماره همراه این موارد یافت شد",
    //   status: 200,
    //   lectureFound,
    // });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "خطای ناشناخته !!!" });
  }
}
