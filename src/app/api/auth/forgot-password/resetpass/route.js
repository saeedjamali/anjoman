
import userModel from "@/models/base/User";
import { hashPassword } from "@/utils/auth";
import connectToDB from "@/utils/db";

export async function POST(req) {

    const body = await req.json();
    const { phone, role, password } = body;

    // Validation (You) ✅

    try {
        const { isConnected } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "failed connect to database", status: 500 });
        }

        const newHashedPassword = await hashPassword(password);
        const userUpdated = await userModel.findOneAndUpdate({ $and: [{ phone }, { role }] }, { password: newHashedPassword })
        if (!userUpdated) {

            return Response.json({ message: "خطا در تغییر رمز عبور", status: 401 });
        }
        return Response.json({ message: "تغییر رمز عبور با موفقیت انجام شد", status: 201 });

    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Unknown Error" },
            { status: 500 }
        );
    }
}
