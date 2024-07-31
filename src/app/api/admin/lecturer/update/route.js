import connectToDB from "@/utils/db";
import { authAdminApi } from "@/utils/authenticateMe";
import lecturerModel from "@/models/lecturer/lecturer";
import { getRndInteger } from "@/utils/random";
import { writeFile } from "fs/promises";
import path from "path";
export async function PUT(req, { params }) {
  if (!(await authAdminApi())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }

  try {
    const formData = await req.formData();
    const year = formData.get("year");
    const user = formData.get("user");
    const name = formData.get("name");
    const phone = formData.get("phone");
    const prsCode = formData.get("prsCode");
    const meliCode = formData.get("meliCode");
    const occuptionState = formData.get("occuptionState");
    const organ = formData.get("organ");
    const isAcademic = formData.get("isAcademic");
    const typeAcademic = formData.get("typeAcademic");
    const govermental = formData.get("govermental");
    const province = JSON.parse(formData.get("province"));
    const Region = JSON.parse(formData.get("region"));
    const degree = JSON.parse(formData.get("degree"));
    const field = JSON.parse(formData.get("field"));
    const isCertificateBefore = formData.get("isCertificateBefore");
    const age = formData.get("age");
    const isAccepted = formData.get("isAccepted");
    const comment = formData.get("comment");
    const status = formData.get("status");
    const payment = formData.get("payment");
    const replyProt = formData.get("replyProt");
    const DocProt = formData.getAll("DocProt");

    console.log("DocProt--->", DocProt);
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    const updateLecturer = await lecturerModel.findOneAndUpdate(
      { $and: [{ phone }, { year }, { isRemoved: false }] },
      {
        name,
        phone,
        prsCode,
        meliCode,
        occuptionState,
        organ,
        isAcademic,
        typeAcademic,
        govermental,
        province,
        Region,
        degree,
        field,
        isCertificateBefore,
        age,
        isAccepted,
        comment,
        status,
        payment,
        replyProt,
      }
    );

    DocProt?.map(async (img, index) => {
      const buffer = Buffer.from(await img.arrayBuffer());
      const filename =
        phone + "" + Date.now() + "" + getRndInteger(10, 100) + "" + img.name;
      const imgPath = path.join(
        process.cwd(),
        "upload/lecturer/prot/" + filename
      );
      await writeFile(imgPath, buffer);

      await lecturerModel.updateOne(
        { $and: [{ phone }, { year }, { isRemoved: false }] },
        {
          DocProt: `${filename}`,
        }
      );
    });
    // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
    if (!updateLecturer) {
      return Response.json({
        message: "برای این مدرس اطلاعاتی یافت نشد",
        status: 401,
      });
    }

    return Response.json({
      message: " اطلاعات مدرس با موفقیت بروز شد",
      status: 201,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "خطای ناشناخته !!!" });
  }
}
