const request = require("request");
import connectToDB from "@/utils/db";
import otpModel from "@/models/base/Otp";
import userModel from "@/models/base/User"
import * as jose from "jose";
export async function POST(req) {
    const body = await req.json();
    const { phone, role } = body;

    const now = new Date();
    const expTime = now.getTime() + 120_000; // 5 Mins

    const code = Math.floor(Math.random() * 99999).toString().padEnd(5, "0");

    try {
        const userFounded = await userModel.findOne({ $and: [{ phone }, { role }] })
        if (!userFounded) {

            return Response.json({ message: "کاربری با این مشخصات-نقش یافت نشد", status: 401 });
        }


        request.post(
            {
                url: 'http://ippanel.com/api/select',
                body: {
                    "op": "pattern",
                    "user": "u09151208032",
                    "pass": "Faraz@1408650850000068",
                    "fromNum": "3000505",
                    "toNum": phone,
                    "patternCode": "uzjj070v0q8v36y",
                    "inputData": [
                        { "verification-code": code }
                    ]
                },
                json: true,
            },
            async function (error, response, body) {

                if (!error && response.statusCode === 200) {
                    //YOU‌ CAN‌ CHECK‌ THE‌ RESPONSE‌ AND SEE‌ ERROR‌ OR‌ SUCCESS‌ MESSAGE
                    const { isConnected } = await connectToDB();
                    if (!isConnected) {
                        return Response.json({ message: "Error in connect to db :))", status: 500 });
                    }

                    const otp = await otpModel.findOneAndUpdate({ phone }, { code, expTime });
                    if (otp) {
                        return Response.json({ message: "کد با موفقیت ارسال شد :))", status: 200 });
                    }
                } else {
                    console.log(error);
                }
            }
        );

        return Response.json(
            { message: "کد با موفقیت ارسال شد :))", status: 200 }
        );
    } catch (error) {
        console.log("Catch error ---->", error)
        return Response.json(
            { message: "Sent error :))", status: 401 })
    }
}
