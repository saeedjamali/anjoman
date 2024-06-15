import connectToDB from "@/utils/db";
import companyModel from "@/models/company/company";
import regCompanyModel from "@/models/company/regcompany";
import regionModel from "@/models/base/Region";
import { authenticateMe } from "@/utils/authenticateMe";
export async function GET(req, { params }) {
  const regId = params.id[0];
  const year = params.id[1];

  if (!(await authenticateMe())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });

}
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    const findRegion = await regionModel.findOne({ regionCode: regId });
    const findCompany = await regCompanyModel
      .findOne({ $and: [{ year }, { Region: findRegion._id }] })
      .populate({
        path: "companies",
      });
    if (findCompany.companies.length == 0) {
      return Response.json({
        message: "برای این منطقه آموزشی ، شرکتی تعریف نشده است.",
        status: 401,
      });
    }
    return Response.json({
      message: "با موفقیت دریافت شد",
      status: 201,
      findCompany,
    });
  } catch (error) {
    console.log("error in catch-->", error);
  }
}
