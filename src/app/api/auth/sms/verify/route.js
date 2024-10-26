
import OtpModel from "@/models/base/Otp";
import connectToDB from "@/utils/db";

export async function POST(req) {

    const body = await req.json();
    const { phone, code } = body;

    if (!phone) {
        throw new Error("phone is not corrected...");
      }
    try {
        const { isConnected } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه" , status: 500 });
        }
        const otp = await OtpModel.findOne({ phone, code });

        if (otp) {
            const date = new Date();
            const now = date.getTime();

            if (otp.expTime > now) {
                return Response.json({ message: "کد صحیح می باشد" ,status: 200 });
            } else {
                return Response.json({ message: "کد منقضی شده است" , status: 410 });
            }
        } else {
            return Response.json(
                { message: "کد اشتباه است" , status: 409 }
            );
        }
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Unknown Error" },
            { status: 500 }
        );
    }
}
