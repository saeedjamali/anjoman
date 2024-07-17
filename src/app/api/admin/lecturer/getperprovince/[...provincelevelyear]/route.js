import lecturerModel from "@/models/lecturer/lecturer";
import { authAdminApi } from "@/utils/authenticateMe";

import connectToDB from "@/utils/db";

export async function GET(req, { params }) {
  if (!(await authAdminApi())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }

  // const regionId = await params.regionid;
  const level = params.provincelevelyear[0];
  const regionCode = params.provincelevelyear[1];
  const provinceCode = params.provincelevelyear[2];
  const year = params.provincelevelyear[3];
  let lecturerList = [];
  try {
    const { isConnected } = await connectToDB();

    if (!isConnected) {
      return Response.json({ message: "عدم ارتباط با پایگاه", status: 501 });
    }

    if (level == 1) {
      return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
    }

    if (level == 2) {
      lecturerList = await lecturerModel
        .find({
          $and: [
            { "province.code": provinceCode },
            { year },
            { isRemoved: false },
          ],
        })
        .populate([
          {
            path: "paymentId",
          },
          {
            path: "testCenter",
          },
        ]);
    }
    if (level == 3) {
      lecturerList = await lecturerModel
        .find({
          $and: [{ year }, { isRemoved: false }],
        })
        .populate([
          {
            path: "paymentId",
          },
          {
            path: "testCenter",
          },
        ]);
    }
    if (level == 999) {
      lecturerList = await lecturerModel
        .find({
          $and: [{ year }, { isRemoved: false }],
        })
        .populate([
          {
            path: "paymentId",
          },
          {
            path: "testCenter",
          },
        ]);
    }

    // console.log("lecturerList---------->", lecturerList);
    if (lecturerList.length != 0) {
      return Response.json({
        message: "لیست ثبت نام ها با موفقیت دریافت شد",
        status: 201,
        lecturerList,
      });
    }
    return Response.json({
      message: "ثبت نامی  وجود ندارد",
      status: 401,
    });
  } catch (error) {
    console.log("Error in api get admin lecturer-->", error);
    return Response.json({ message: "خطای ناشناخته", status: 501 });
  }
}
