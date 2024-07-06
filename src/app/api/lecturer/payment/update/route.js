import connectToDB from "@/utils/db";
import lecturerModel from "@/models/lecturer/lecturer";
import { authenticateLecturer } from "@/utils/authenticateMe";

export async function PUT(req) {
    if (!(await authenticateLecturer())) {
        return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
    }
    const body = await req.json();
    const { orderId, userId, year } = body;
    // console.log("UserId--->", body)
    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }

        const updateLecturer = await lecturerModel.findOneAndUpdate(
            { $and: [{ _id: userId }, { year }] },
            {

                orderId,

            }
        );

        // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
        if (!updateLecturer) {
            return Response.json({
                message: "کاربری با این مشخصات یافت نشد",
                status: 401,
            });
        }

        return Response.json({
            message: " اطلاعات شناسه پرداخت با موفقیت بروز شد",
            status: 201,
            orderId
        });
    } catch (error) {
        console.log("Error ->", error);
        return Response.json({ message: "خطای ناشناخته !!!" });
    }
}
