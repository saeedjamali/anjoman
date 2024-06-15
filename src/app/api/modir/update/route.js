import connectToDB from "@/utils/db";
import modirModel from "@/models/modiran/modir"
import userModel from "@/models/base/User"
import { authenticateMe } from "@/utils/authenticateMe";



export async function PUT(req) {
    const body = await req.json();
    const { user, name, phone, meliCode, prsCode } = body;
    if (!(await authenticateMe())) {
        return Response.json({ message: "دسترسی غیر مجاز", status: 500 });

    }
    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }

        const updateModir = await modirModel.findOneAndUpdate({ user }, { phone, meliCode, prsCode, name, isActive: 0 });

        // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
        if (!updateModir) {
            return Response.json({ message: "خطا در اصلاح مشخصات مدیر", status: 401 });
        }

        // const userIsActive = await userModel.findOneAndUpdate({ _id: user }, { isActive: 0 });
        return Response.json({ message: "اصلاح اطلاعات با موفقیت انجام شد", status: 200 });
    } catch (error) {
        console.log("Error ->", error)
        return Response.json({ message: "خطای ناشناخته !!!" });
    }
}