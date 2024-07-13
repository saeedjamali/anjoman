import connectToDB from "@/utils/db";
import tokenModel from "@/models/payment/token";
import { authenticateLecturer } from "@/utils/authenticateMe";

export async function POST(req, { params }) {
    if (!(await authenticateLecturer())) {
      return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
    }
  const orderId = params.orderid;
  const { token } = await req.json();
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    const tokenLecturer = await tokenModel.findOneAndUpdate(
      { orderId },
      {
        token,
      }
    );

  
    if (!tokenLecturer) {
      const tokenFounded = await tokenModel.create({ orderId, token });
      return Response.json({
        message: "OrderId Create and Token add Successfully :))",
        status: 201,
      });
    }

    return Response.json({
      message: " اطلاعات شناسه پرداخت با موفقیت بروز شد",
      status: 201,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "خطای ناشناخته !!!" });
  }
}
