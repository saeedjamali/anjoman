import { cookies } from "next/headers";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { permanentRedirect, redirect } from "next/navigation";
import lectureModel from "@/models/lecturer/lecturer";
import paymentModel from "@/models/payment/payment";
import tokenModel from "@/models/payment/token";
export async function POST(req, { params }) {
  try {
    const orderIdParams = params.orderid;
    console.log("orderIdParams--->", orderIdParams);
    const { token } = await tokenModel.findOne({
      orderId: orderIdParams
    });
    console.log("Token is---->", token);
    console.log("orderIdParams is---->", orderIdParams);

    // const token = cookies().get("paymentData")?.value;
    // const token = req.token;

    // if (!token) {
    //   return NextResponse.json(
    //     { error: "No payment token found" },
    //     { status: 400 }
    //   );
    // }

    if (!token) {
      return NextResponse.json(
        {
          error:
            "خطا در پرداخت - در صورت کسر از حساب مبلغ حداکثر تا 72 ساعت بعد به حساب شما باز میگردد - از یک مرورگر دیگر برای پرداخت استفاده نمایید.",
        },
        { status: 400 }
      );
    }

    const keyBuffer = Buffer.from("KTje3RNIhbijwGG2p69YQraFN5errUTV", "base64");
    const cipher = crypto.createCipheriv("des-ede3", keyBuffer, null);
    cipher.setAutoPadding(true);

    let encryptedSignData = cipher.update(token, "utf8", "base64");
    encryptedSignData += cipher.final("base64");
    // console.log("go to post api...---->");
    const response = await fetch(
      "https://sadad.shaparak.ir/api/v0/Advice/Verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, SignData: encryptedSignData }),
      }
    );

    const data = await response.json();
    console.log("Data Payment is---->", data);
    if (data.ResCode == 0) {
      const payment = await paymentModel.create({
        resCode: data.ResCode,
        orderId: data.OrderId,
        amount: data.Amount,
        description: data.Description,
        retrivalRefNo: data.RetrivalRefNo,
        systemTraceNo: data.SystemTraceNo,
      });
      if (payment) {
        const statusUpdate = await lectureModel.findOneAndUpdate(
          { orderId: data.OrderId },
          {
            status: 1,
            paymentId: payment._id,
          }
        );
      }

      // console.log("statusUpdate---->", statusUpdate);
      return NextResponse.redirect(
        new URL(`https://peyvand.razaviedu.ir/api`, req.url)
      );
      // if (statusUpdate) {
      //   const paymentFounded = await paymentModel.findOne({
      //     orderId: data.OrderId,
      //   });
      //   if (paymentFounded) {
      //     console.log("OrderId before is Exist!  ");
      //   } else {
      //     const payment = await paymentModel.create({
      //       resCode: data.ResCode,
      //       orderId: data.OrderId,
      //       amount: data.Amount,
      //       description: data.Description,
      //       retrivalRefNo: data.RetrivalRefNo,
      //       systemTraceNo: data.SystemTraceNo,
      //     });
      //     // return NextResponse.redirect(
      //     //   new URL(`http://localhost:3000/api`, req.url)
      //     // );
      //     return NextResponse.redirect(
      //       new URL(`https://peyvand.razaviedu.ir/api`, req.url)
      //     );
      //   }
      // } else {
      //   console.log("update status in lecturer model is failed!!");
      //   return NextResponse.redirect(
      //     new URL(`https://peyvand.razaviedu.ir/api`, req.url)
      //   );
      // }
    } else {
      return NextResponse.redirect(
        new URL(`https://peyvand.razaviedu.ir/api`, req.url)
      );
    }

    // const url = req.nextUrl.clone();

    // const request = req.url.origin;
    // console.log('data :>> ', data);
    // console.log('response :>> ', response);

    // console.log('req222 :>> ', res.searchParams);
    // console.log("Data NextURL-->", req.NextURL);

    // Serialize the data to use in the query parameters
    // const serializedData = encodeURIComponent(JSON.stringify(data));

    // Redirect with the data as a query parameter
    // const response2 = await fetch("/api/lecturer/payment/verify")
    // const data2= await response2.json
    //  return Response.json({data})
    // return NextResponse.redirect('/p-lecturer/verify', { status: 308 });
    // permanentRedirect(`https://peyvand.razaviedu.ir/p-lecturer`);
    // return new NextResponse(JSON.stringify({ success: true, message: "verify ok" }), {
    //     status: 401,
    //     headers: { "content-type": "application/json" },
    // });
    // return <div>test </div>
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(
      new URL(`https://peyvand.razaviedu.ir/api`, req.url)
    );

    // return Response.json({ error: error.message }, { status: 500 });
  }
}

// export async function GET() {
//     return new Response("Method Not Allowed", { status: 405 });
// }
export async function GET(req, res) {
  // const response = NextResponse.next();
  // console.log("response--->", res)
  // console.log("req--->", req)
  // deleteCookie('paymentData', { req, res });
  // cookies.delete('paymentData')
  permanentRedirect(`https://peyvand.razaviedu.ir/p-lecturer`);
  // // return NextResponse.redirect(new URL(`http://localhost:3000`, req.url));

  // return Response.json({ message: "Hello" })
}
