import contractModel from "@/models/modiran/contract";
import { authenticateMe } from "@/utils/authenticateMe";
import connectToDB from "@/utils/db";

export async function GET(req, { params }) {
  const units = await params.unitid;
  const uniqueUnit = new Set(units);
  const array = [...uniqueUnit];
  // const u = JSON.parse(units);
  if (!(await authenticateMe())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }

  try {
    const { isConnected } = await connectToDB();

    if (!isConnected) {
      return Response.json({ message: "عدم ارتباط با پایگاه", status: 501 });
    }

    // let contractlist = [];
    let contractlist = [];
    await Promise.all(
      array.map(async (unit) => {
        contractlist.push(
          ...(await contractModel.find({ "Unit.schoolCode": unit }).populate([
            {
              path: "company",
            },
          ]))
        );
      })
    );
    // console.log("contractlist --->", contractlist);

    if (contractlist.length != 0) {
      return Response.json({
        message: "لیست قرارداد ها با موفقیت دریافت شد",
        status: 201,
        contractlist,
      });
    }
    return Response.json({
      message: "قراردادی از قبل وجود ندارد",
      status: 401,
      contractlist,
    });
  } catch (error) {
    console.log("Error in api get contract-->", error);
    return Response.json({ message: "خطای ناشناخته", status: 501 });
  }
}
