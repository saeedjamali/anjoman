import connectToDB from "@/utils/db";
import regionModel from "@/models/base/Region";
import { authAdmin, authManagerApi } from "@/utils/authenticateMe";

export async function PUT(req, { params }) {
  if (!(await authManagerApi())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });

}
  const regCode = params.regionId;

  const body = await req.json();
  const { provinceName, provinceCode, regionName, accessType } = body;

  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    const updateRegion = await regionModel.findOneAndUpdate(
      { _id: regCode },
      {
        provinceName,
        provinceCode,
        regionName,
        accessType,
      }
    );

    // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
    if (!updateRegion) {
      return Response.json({
        message: "برای این منطقه اطلاعاتی یافت نشد",
        status: 401,
      });
    }

    return Response.json({
      message: " اطلاعات منطقه با موفقیت بروز شد",
      status: 201,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "خطای ناشناخته !!!" });
  }
}

export async function DELETE(req, { params }) {
  const regCode = params.regionId;

  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    //اطلاعات واحد سازمانی حذف نمی شود/ بلکه وضعیت به لغو تغییر میکند
    const deletedRegion = await regionModel.findOneAndDelete({ _id: regCode });

    // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
    if (!deletedRegion) {
      return Response.json({ message: "خطا در حذف منطقه", status: 401 });
    }

    return Response.json({
      message: " حذف منطقه انجام شد",
      status: 201,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "خطای ناشناخته!!!" });
  }
}
