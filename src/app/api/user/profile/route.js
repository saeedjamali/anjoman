import userModel from "@/models/base/User";
import {
  authenticateLecturer,
  authenticateMe,
  authenticateUser,
} from "@/utils/authenticateMe";
import connectToDB from "@/utils/db";
import { getRndInteger } from "@/utils/random";
import { image } from "@nextui-org/react";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  if (!(await authenticateUser())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }
  const { isConnected, message } = await connectToDB();
  const formData = await req.formData();
  console.log("formData--->", formData);

  const profile = formData.getAll("profileImage");
  const userId = formData.get("id");
  const phone = formData.get("phone");

  try {
    //Buffer
    if (profile.length == 0) {
      return Response.json({
        message: "لطفا اطلاعات بطور کامل بررسی و مجدد ارسال شود",
        status: 401,
      });
    }

    profile?.map(async (img, index) => {
      const buffer = Buffer.from(await img.arrayBuffer());
      const filename =
        phone + "" + Date.now() + "" + getRndInteger(10, 100) + "" + img.name;
      const imgPath = path.join(
        process.cwd(),
        "upload/user/profile/" + filename
      );
      await writeFile(imgPath, buffer);

      await userModel.updateOne(
        { _id: userId },
        {
          profile: `${filename}`,
        }
      );
    });
    return Response.json({
      message: "تصویر پروفایل با موفقیت بروز شد",
      status: 201,
    });
  } catch (error) {
    console.log("error in api add lecturer>>", error);
    return Response.json({ message: "خطای ناشناخته", status: 501 });
  }

  //   return Response.json({ message: "خطا در ارسال اطلاعات", status: 401 });
}
