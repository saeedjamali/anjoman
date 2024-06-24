import FieldModel from "@/models/base/Field";
import { field } from "@/utils/constants";
import connectToDB from "@/utils/db";

export async function GET(req, { params }) {
    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }


        const fields = await FieldModel.find({}, "-createdAt -updatedAt");

        if (!fields) {
            return Response.json({
                message: "رشته تحصیلی یافت نشد",
                status: 401,
            });
        }
        return Response.json({
            message: "رشته تحصیلی با موفقیت دریافت شد",
            status: 200,
            fields
        });
    } catch (error) {
        console.log("Error ->", error);
        return Response.json({ message: "Unknown error !!!" });
    }
}
