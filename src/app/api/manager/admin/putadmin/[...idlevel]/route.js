import connectToDB from "@/utils/db";
import adminModel from "@/models/admin/adminRegion";
import regionModel from "@/models/base/Region";
import { authAdmin, authManagerApi } from "@/utils/authenticateMe";

export async function PUT(req, { params }) {
  const adminId = params.idlevel[0];
  const levelAdmin = params.idlevel[1];

  if (!(await authManagerApi()) && (levelAdmin != 3 || levelAdmin != 999)) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }
  try {
    const body = await req.json();
    const { name, prsCode, meliCode, isActive, regionCode, comment, level } =
      body;
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }
    const region = await regionModel.findOne({ regionCode });

    if (!region) {
      return Response.json({ message: "این کد منطقه یافت نشد", status: 401 });
    }
    const updateAdmin = await adminModel.findOneAndUpdate(
      { _id: adminId },
      {
        name,
        prsCode,
        meliCode,
        isActive,
        level,
        Region: region,
        comment,
      }
    );

    // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
    if (!updateAdmin) {
      return Response.json({
        message: "برای این کارشناس اطلاعاتی یافت نشد",
        status: 401,
      });
    }
    return Response.json({
      message: " اطلاعات کارشناس با موفقیت بروز شد",
      status: 201,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "خطای ناشناخته !!!" });
  }
}
