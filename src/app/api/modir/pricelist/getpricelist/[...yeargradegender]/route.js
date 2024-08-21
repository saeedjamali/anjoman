import connectToDB from "@/utils/db";
import priceListModel from "@/models/company/pricelist";
import { authenticateMe } from "@/utils/authenticateMe";

export async function GET(req, { params }) {
  if (!(await authenticateMe())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }
  const year = await params?.yeargradegender[0];
  const grade = await params?.yeargradegender[1];
  const gender = await params?.yeargradegender[2];
  // const rowperpage = params.page[1];// row per page
  // let start = ((page - 1) * rowperpage) + 1;
  // let end = Number(start) + Number(rowperpage);
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    if (!year) {
      const pricelist = await priceListModel.find();
      const len = pricelist.length;
      return Response.json({
        message: "اطلاعات با موفقیت دریافت شد",
        status: 201,
        pricelist,
        len,
      });
    }
    if (year && !grade && !gender) {
      const pricelist = await priceListModel.find({ year });
      const len = pricelist.length;
      return Response.json({
        message: "اطلاعات با موفقیت برای سال تحصیلی جاری دریافت شد",
        status: 201,
        pricelist,
        len,
      });
    }

    if (gender == 3) {
      const pricelist = await priceListModel.find({ year });
      // const pricelist = await priceListModel.find({ $and: [{ year }, { grade }] });
      const len = pricelist.length;
      return Response.json({
        message: "اطلاعات با موفقیت براساس سال تحصیلی ، مقطع و جنسیت دریافت شد",
        status: 201,
        pricelist,
        len,
      });
    }

    // const pricelist = await priceListModel.find({ $and: [{ year }, { grade }, { gender }] });
    //? با توجه به مشخص نبودن مقطع و جنسیت فعلا فیلتر مقطع را برمیداریم
    const pricelist = await priceListModel.find({ year });
    if (pricelist) {
      const len = pricelist.length;
      return Response.json({
        message: "اطلاعات با موفقیت براساس سال تحصیلی ، مقطع و جنسیت دریافت شد",
        status: 201,
        pricelist,
        len,
      });
    }
    return Response.json({
      message: "اطلاعات متناسب با این دوره و جنسیت یافت نشد",
      status: 401,
      pricelist,
      len,
    });
  } catch (error) {
    console.log("Error--->", error);
  }
}
