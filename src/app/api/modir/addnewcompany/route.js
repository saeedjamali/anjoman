import connectToDB from "@/utils/db";
import companyModel from "@/models/company/company";
import regCompanyModel from "@/models/company/regcompany";
import regionModel from "@/models/base/Region";
import {
  authAdmin,
  authenticateMe,
  authManagerApi,
} from "@/utils/authenticateMe";

export async function POST(req) {
  if (!(await authenticateMe())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }

  const formData = await req.formData();

  const year = formData.get("year");
  const region = formData.get("region");
  const owner = formData.get("owner");
  const phone = formData.get("phone");
  const ownerCode = formData.get("ownerCode");
  const name = formData.get("name");
  const address = formData.get("address");
  const id = formData.get("id"); //? Id modir

  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    let maxCode = 0;
    maxCode = await companyModel.find({}).sort({ code: -1 }).limit(1);
    let newCode =
      maxCode[0]?.code == 0 || !maxCode[0]?.code ? 10001 : maxCode[0]?.code + 1;

    // console.log("maxCode--->", maxCode);
    // console.log("newCode--->", newCode);
    const newCompany = await companyModel.create({
      code: newCode,
      owner,
      phone,
      ownerCode,
      name,
      address,
      isActive: 1,
      year,
      capacity: 0,
      creator: id,
    });

    const foundedRegion = await regionModel.findOne({ regionCode: region });

    if (foundedRegion && newCompany) {
      const addCompanyToRegion = await regCompanyModel.findOneAndUpdate(
        { Region: foundedRegion._id },
        { $push: { companies: newCompany._id } }
      );

      if (addCompanyToRegion) {
        // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
        return Response.json({
          message: "اطلاعات شرکت در قسمت شرکت ها افزوده شد",
          status: 201,
          newCompany,
        });
      } else {
        const addCompanyToRegion = await regCompanyModel.create(
          { Region: foundedRegion._id, year,companies: newCompany._id  }
        
        );
        return Response.json({
          message: "اطلاعات شرکت در قسمت شرکت ها افزوده شد",
          status: 201,
          newCompany,
        });
      }
    }

    return Response.json({
      message: " خطا در افزودن شرکت",
      status: 401,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "خطای ناشناخته !!!" });
  }
}
