import connectToDB from "@/utils/db";
import companyModel from "@/models/company/company"
import { authAdmin, authManagerApi } from "@/utils/authenticateMe";

export async function GET(req, { params }) {
    if (!(await authManagerApi())) {
        return Response.json({ message: "دسترسی غیر مجاز", status: 500 });

    }
    const year =await params.year;
    // const rowperpage = params.page[1];// row per page
    // let start = ((page - 1) * rowperpage) + 1;
    // let end = Number(start) + Number(rowperpage);
    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }
        const companies = await companyModel.find({ $or: [{ isActive: 0 }, { isActive: 1 }], $and: [{ year }] });
        // const unitSelected = units?.slice(start, end);
        const len = companies.length
        return Response.json({ message: "اطلاعات با موفقیت دریافت شد", status: 201, companies, len });

    } catch (error) {

    }


}