import connectToDB from "@/utils/db";
import scoreModel from "@/models/result/score";
export async function POST(req) {
  const formData = await req.formData();
  const identifier = formData.get("identifier");
  const password = formData.get("password");

  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    const result = await scoreModel.findOne({
      $and: [{ codeMeli: identifier }, { birthDay: password }],
    });
    // console.log("result-->", result);
    if (result) {
      return Response.json({
        message: " اطلاعات با موفقیت دریافت شد",
        status: 201,
        result,
      });
    }
    return Response.json({
      message: "با این مشخصات اطلاعاتی یافت نشد",
      status: 401,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "خطای ناشناخته !!!" });
  }
}
