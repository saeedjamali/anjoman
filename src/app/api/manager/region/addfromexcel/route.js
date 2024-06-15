import connectToDB from "@/utils/db";
import regionModel from "@/models/base/Region";
import { authAdmin, authManagerApi } from "@/utils/authenticateMe";
export async function POST(req) {
  const region = await req.json();
  if (!(await authManagerApi())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });

}
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    let updated = 0,
      added = 0;
    await Promise.all(
      await region.map(async (item) => {
        const {
          provinceName,
          provinceCode,
          regionCode,
          regionName,
          accessType,
        } = item;
        const regionUpdated = await regionModel.findOneAndUpdate(
          { regionCode },
          {
            $set: {
              provinceName,
              regionName,
              accessType,
            },
          }
        );
        if (regionUpdated) {
          updated = updated + 1;
        } else {
          const regionCreated = await regionModel.create({
            provinceName,
            provinceCode,
            regionCode,
            regionName,
            accessType,
          });
          added = added + 1;
        }
      })
    );

    return Response.json({
      message: `${added} منطقه اضافه و ${updated} بروز شد`,
      status: 201,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "خطای ناشناخته !!!" });
  }
}
