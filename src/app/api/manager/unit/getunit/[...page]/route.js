import connectToDB from "@/utils/db";
import unitModel from "@/models/base/Unit"
import { authAdmin, authManagerApi } from "@/utils/authenticateMe";

export async function GET(req, { params }) {
    if (!(await authManagerApi())) {
        return Response.json({ message: "دسترسی غیر مجاز", status: 500 });

    }
    const page = params.page[0];
    const rowperpage = params.page[1];// row per page
    let start = ((page - 1) * rowperpage) + 1;
    let end = Number(start) + Number(rowperpage);
    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }
        const units = await unitModel.find(); //شرکت های فعال دریافت شود
        // const unitSelected = units?.slice(start, end);
        const len = units.length
        return Response.json({ message: "خطا در اتصال به پایگاه", status: 201, units, len });

    } catch (error) {

    }


}