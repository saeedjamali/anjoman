import connectToDB from "@/utils/db";
import lecturerModel from "@/models/lecturer/lecturer";
import {
  authAdmin,
  authAdminApi,
  authManagerApi,
} from "@/utils/authenticateMe";
export async function POST(req) {
  const result = await req.json();
  if (!(await authAdminApi())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    await Promise.all(
      await result.map(async (item) => {
        const { result, phone } = item;
        const lecturerUpdated = await lecturerModel.findOneAndUpdate(
          { $and: [{ phone }, { isRemoved: false }] },
          {
            $set: {
              status: result,
            },
          }
        );
      })
    );

    return Response.json({
      message: "نمرات آزمون مدرسین بروز شد",
      status: 201,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "خطای ناشناخته !!!" });
  }
}
