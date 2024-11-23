import contractModel from "@/models/modiran/contract";
import { authAdmin, authAdminApi } from "@/utils/authenticateMe";
import { year } from "@/utils/constants";
import connectToDB from "@/utils/db";

export async function GET(req, { params }) {
  if (!(await authAdminApi())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }

 
  // const regionId = await params.regionid;
  const level = params.regionlevelyear[0];
  const regionCode = params.regionlevelyear[1];
  const provinceCode = params.regionlevelyear[2];
  const year = params.regionlevelyear[3];
  let contractlist = [];
  try {
    const { isConnected } = await connectToDB();

    if (!isConnected) {
      return Response.json({ message: "عدم ارتباط با پایگاه", status: 501 });
    }

    if (level == 1) {
      contractlist = await contractModel
        .find({ $and: [{ "Unit.regionCode": regionCode }, { year }] })
        .populate([
          {
            path: "company",
          },
          {
            path: "modir",
          },
        ]);
    }

    if (level == 2) {
      contractlist = await contractModel
        .find({ $and: [{ "Unit.provinceCode": provinceCode }, { year }] })
        .populate([
          {
            path: "company",
          },
          {
            path: "modir",
          },
        ]);
    }
    if (level == 999 || level == 3) {
      contractlist = await contractModel.find({ year }).populate([
        {
          path: "company",
        },
        {
          path: "modir",
        },
      ]);
    }
   
    if (level == 11) {
      contractlist = await contractModel
        .find({ $and: [{ "Unit.regionCode": regionCode }, { year },{ isConfirm:1 }] })
        .populate([
          {
            path: "company",
          },
          {
            path: "modir",
          },
        ]);
    }
    if (contractlist.length != 0) {
      return Response.json({
        message: "لیست قرارداد ها با موفقیت دریافت شد",
        status: 201,
        contractlist,
      });
    }
    return Response.json({
      message: "قراردادی از قبل در این منطقه وجود ندارد",
      status: 401,
    });
  } catch (error) {
    console.log("Error in api get contract-->", error);
    return Response.json({ message: "خطای ناشناخته", status: 501 });
  }
}
