import connectToDB from "@/utils/db";
import companyModel from "@/models/company/company"
import regCompanyModel from "@/models/company/regcompany"
import regionModel from "@/models/base/Region"
import { authAdmin, authManagerApi } from "@/utils/authenticateMe";
export async function get(req) {
    if (!(await authManagerApi())) {
        return Response.json({ message: "دسترسی غیر مجاز", status: 500 });

    }
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
        return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

}