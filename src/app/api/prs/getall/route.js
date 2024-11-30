import connectToDB from "@/utils/db";
import prsModel from "@/models/bime/Prs";
import regModel from "@/models/base/Region";
import { valiadtePrsCode, valiadteSchoolCode } from "@/utils/auth";
import { Result } from "postcss";

export async function POST(req, { params }) {
  return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  // if (!(await authenticateMe())) {
  //   return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  // }
  //   const prsCode = params.id[0];
  //   const phone = params.id[1];

  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    const { role } = await req.json();
    if (role != "9998") {
      return Response.json({ message: "Dont Access !!!" });
    }

    const foundedPrs = await prsModel.find();
    const foundedReg = await regModel.find(
      { provinceCode: "16" },
      "regionCode regionName -_id"
    );

    if (!foundedPrs) {
      return Response.json({
        message: " پرسنل یافت نشد",
        status: 401,
      });
    }
    if (!foundedReg) {
      return Response.json({
        message: " منطقه ای یافت نشد",
        status: 401,
      });
    }
    const data = await prsModel.aggregate([
      {
        $group: {
          _id: "$regCode",
          count: { $sum: 1 }, // this means that the count will increment by 1
        },
      },
    ]);

    let allShaqel = 0,
      allBaz = 0,
      allCancelBaz = 0,
      allcancelShaqel = 0;
    const report = data.map((reg) => {
      const regTitle = foundedReg.find((item) => item.regionCode == reg._id);
      const countShaqelPrs = foundedPrs.filter(
        (prs) => prs.status == 1 && prs.regCode == reg._id
      ).length;
      const countBazPrs = foundedPrs.filter(
        (prs) => prs.status == 2 && prs.regCode == reg._id
      ).length;
      const countCancelShaqelPrs = foundedPrs.filter(
        (prs) => prs.status == 1 && prs.regCode == reg._id && prs.result
      ).length;
      const countCancelBazPrs = foundedPrs.filter(
        (prs) => prs.status == 2 && prs.regCode == reg._id && prs.result
      ).length;
      allShaqel = countShaqelPrs + allShaqel;
      allBaz = allBaz + countBazPrs;
      allCancelBaz = allCancelBaz + countCancelBazPrs;
      allcancelShaqel = allcancelShaqel + countCancelShaqelPrs;
      return {
        regCode: reg._id,
        regName: regTitle.regionName,
        countShaqelPrs,
        countBazPrs,
        countCancelShaqelPrs,
        countCancelBazPrs,
      };
    });
    // console.log("found region ---->", report);
    return Response.json({
      message: " پرسنل یافت شد",
      status: 200,
      result: { report, allShaqel, allBaz, allCancelBaz, allcancelShaqel },
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "Unknown error !!!" });
  }
}
