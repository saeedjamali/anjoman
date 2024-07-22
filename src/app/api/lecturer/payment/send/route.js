import crypto from "crypto";
import { cookies } from "next/headers";
import tokenModel from "@/models/payment/token";
export async function POST(req) {
  try {
    const {
      amount,
      orderId,
      MultiIdentityData,
      MerchantId,
      TerminalId,
      merchantKey,
    } = await req.json();

    // console.log("Order Id------------>", orderId, amount);

    const LocalDateTime = new Date().toISOString();
    const signData = `${TerminalId};${orderId};${amount}`;
    const keyBuffer = Buffer.from(merchantKey, "base64");
    const cipher = crypto.createCipheriv("des-ede3", keyBuffer, null);
    cipher.setAutoPadding(true);

    let encryptedSignData = cipher.update(signData, "utf8", "base64");
    encryptedSignData += cipher.final("base64");

    const response = await fetch(
      "https://sadad.shaparak.ir/api/v0/PaymentByMultiIdentityRequest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          MerchantId,
          TerminalId,
          Amount: amount,
          OrderId: orderId,
          LocalDateTime,
          // ReturnUrl: `http://localhost:3000/api/lecturer/payment/verify/${orderId}`,
          ReturnUrl: `https://peyvand.razaviedu.ir/api/lecturer/payment/verify/${orderId}`,
          SignData: encryptedSignData,
          MultiIdentityData,
        }),
      }
    );

    const data = await response.json();
    const token = data.Token;
    const tokenLecturer = await tokenModel.findOneAndUpdate(
      { orderId },
      {
        token,
      }
    );

    if (!tokenLecturer) {
      const tokenFounded = await tokenModel.create({ orderId, token });
    }

    // const tokenResponse = await fetch(
    //   `/api/lecturer/payment/token/${orderId}`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       token,
    //     }),
    //   }
    // );
    // console.log("data from send--->", data)
    // cookies().set("paymentData", String(token), {
    //   httpOnly: true,
    //   secure: true,
    //   maxAge: 60 * 60,
    //   path: "/",
    // });

    return Response.json(data);
  } catch (error) {
    console.error("Error in send APi", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
