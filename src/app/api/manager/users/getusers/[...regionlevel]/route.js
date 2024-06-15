import connectToDB from "@/utils/db";
import userModel from "@/models/base/User";
import modirUnitModel from "@/models/modiran/modirUnit";
import { authAdmin, authAdminApi, authManagerApi } from "@/utils/authenticateMe";

export async function GET(req, { params }) {
    if (!(await authManagerApi)) {
        return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
    }

    const level = params.regionlevel[0];
    // const regionCode = params.regionlevel[1];
    // const provinceCode = params.regionlevel[2];
    let users = [];

    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }


        if (level == 999) {
            //?global access

            users = await userModel.find();
        }

        if (!users) {
            return Response.json({
                message: "کاربری یافت نشد",
                status: 401,
                users,
                len,
            });
        }
        const len = users.length;
        return Response.json({
            message: "با موفقیت دریافت شد",
            status: 201,
            users,
            len,
        });
    } catch (error) {
        return Response.json({ message: "خطای ناشناخته", status: 500 });
    }
}
