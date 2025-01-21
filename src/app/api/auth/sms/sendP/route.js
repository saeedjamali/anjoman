const request = require("request");
import otpModel from "@/models/base/Otp";
import connectToDB from "@/utils/db";

export async function POST(req) {
  try {
    // let pKey = false;
    const pKey = Date.now();
    if (req.method !== "POST") {
      return false;
    }
    connectToDB();
    const body = await req.json();
    const { phone } = body;
    console.log("Phone---->", phone);
    if (!phone) {
      throw new Error("This api protected and you can't access it !!");
    }
    const now = new Date();
    const expTime = now.getTime() + 300_000; // 5 Mins
    const code = Math.floor(Math.random() * 99999)
      .toString()
      .padEnd(5, "0");

    request.post(
      {
        url: "https://sms.3300.ir/api/wsSend.ashx",
        body: {
          username: "kh-ro",
          password: "r@zAv!1398*",
          line: "9830007485",
          mobile: phone,
          message: `کد اعتبارسنجی سامانه قران و عترت:${code}  `,
          type: 0,
          template: 0,
        },
        json: true,
      },

      async function (error, response, body) {
        if (!error && response.statusCode === 200) {
          //YOU‌ CAN‌ CHECK‌ THE‌ RESPONSE‌ AND SEE‌ ERROR‌ OR‌ SUCCESS‌ MESSAGE
          const { isConnected } = await connectToDB();
          if (!isConnected) {
            return Response.json({
              message: "Error in connect to db :))",
              status: 500,
            });
          }

          const otp = await otpModel.findOneAndUpdate(
            { phone },
            { code, expTime }
          );
          if (otp) {
            return Response.json({
              message: "کد با موفقیت ارسال شد :))",
              status: 200,
            });
          } else {
            const opt = await otpModel.create({ code, phone, expTime });
            return Response.json({
              message: "User Create and Code Sent Successfully :))",
              status: 201,
            });
          }
        } else {
          console.log(error);
        }
      }
    );
    return Response.json({ message: "کد با موفقیت ارسال شد :))", status: 200 });

    // } //end validate IF
  } catch (error) {
    console.log("Catch error ---->", error);
    return Response.json({ message: "Sent error :))", status: 401 });
  }
}
