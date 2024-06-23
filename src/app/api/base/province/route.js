import ProvinceModel from "@/models/base/Province";
import { province } from "@/utils/constants";
import connectToDB from "@/utils/db";

export async function GET(req, { params }) {
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    ProvinceModel.bulkWrite(
      province.map((item) => ({
        updateOne: {
          filter: { code: item.code },
          update: { $set: { name: item.name } },
          upsert: true,
        },
      }))
    );

    

    return Response.json({
      message: "استان ها با موفقیت ثبت یا بروز شد",
      status: 200,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "Unknown error !!!" });
  }
}
