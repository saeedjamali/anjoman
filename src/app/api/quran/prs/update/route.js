import connectToDB from "@/utils/db";
import quranModel from "@/models/quran/Quran";
import { authAdmin, authManagerApi } from "@/utils/authenticateMe";

export async function PUT(req, { params }) {
  // return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  try {
    const body = await req.json();
    const { prs, phone, result } = body;
    console.log("prsCode-->", prs);
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }
    const prsFounded = await quranModel.findOne({ prs });

    if (!prsFounded) {
      return Response.json({ message: "اطلاعات پرسنل یافت نشد", status: 401 });
    }

    console.log("prs-->", prsFounded);
    if (prsFounded.phone && prsFounded?.phone != phone) {
      return Response.json({
        message: "اطلاعات قبلا با شماره همراه دیگری ثبت شده است",
        status: 401,
      });
    }

    const updatePrs = await quranModel.findOneAndUpdate(
      { prs },
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
      message: " اطلاعات ابلاغ با موفقیت بروز شد",
      status: 200,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "خطای ناشناخته !!!" });
  }
}
