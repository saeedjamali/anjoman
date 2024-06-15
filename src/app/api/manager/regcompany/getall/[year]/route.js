import connectToDB from "@/utils/db";
import companyModel from "@/models/company/company"
import regCompanyModel from "@/models/company/regcompany"
import regionModel from "@/models/base/Region"
import { authAdmin, authManagerApi } from "@/utils/authenticateMe";
export async function GET(req, { params }) {
    if (!(await authManagerApi())) {
        return Response.json({ message: "دسترسی غیر مجاز", status: 500 });

    }
    const year = await params.year;
    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }
        const regCompanies = await regCompanyModel.find({ year })

        if (regCompanies.length == 0) {
            return Response.json({ message: "منطقه - شرکت در سال تحصیلی جاری یافت نشد", status: 202 })
        }
        return Response.json({ message: "دریافت اطلاعات منطقه-شرکت با موفقیت انجام شد", status: 201, regCompanies })

    } catch (error) {
        return Response.json({ message: "خطای ناشناخته", status: 500 })
    }

}