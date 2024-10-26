import connectToDB from "@/utils/db";
import prsModel from "@/models/bime/Prs";
import { authAdmin, authManagerApi } from "@/utils/authenticateMe";

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const { prsCode, phone, result } = body;

    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }
    const prs = await prsModel.findOne({ prsCode });

    if (!prs) {
      return Response.json({ message: "اطلاعات پرسنل یافت نشد", status: 401 });
    }

    if (prs.phone && prs.phone != phone) {
      return Response.json({
        message: "اطلاعات قبلا با شماره همراه دیگری ثبت شده است",
        status: 401,
      });
    }

    const updatePrs = await prsModel.findOneAndUpdate(
      { prsCode },
      {
        phone,
        result,
      }
    );

    // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
    if (!updatePrs) {
      return Response.json({
        message: "برای این پرسنل اطلاعاتی یافت نشد",
        status: 401,
      });
    }

    return Response.json({
      message: " اطلاعات بیمه پرسنل با موفقیت بروز شد",
      status: 200,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "خطای ناشناخته !!!" });
  }
}
