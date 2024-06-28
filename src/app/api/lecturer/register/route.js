import lecturerModel from "@/models/lecturer/lecturer";
import { authenticateLecturer, authenticateMe } from "@/utils/authenticateMe";
import connectToDB from "@/utils/db";
import { getRndInteger } from "@/utils/random";
import { image } from "@nextui-org/react";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  if (!(await authenticateLecturer())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }
  const { isConnected, message } = await connectToDB();
  const formData = await req.formData();
  const year = formData.get("year");
  const name = formData.get("name");
  const phone = formData.get("phone");
  const prsCode = formData.get("prsCode");
  const meliCode = formData.get("meliCode");
  const occuptionState = formData.get("occuptionState");
  const organ = formData.get("organ");
  const isAcademic = formData.get("isAcademic");
  const typeAcademic = formData.get("typeAcademic");
  const govermental = formData.get("govermental");
  const province = formData.get("province");
  const Region = formData.get("region");
  const degree = formData.get("degree");
  const field = formData.get("field");
  const introDoc = formData.getAll("introDoc");
  const degreeDoc = formData.getAll("degreeDoc");
  const certificateDoc = formData?.getAll("certificateDoc");
  const isCertificateBefore = formData.get("isCertificateBefore");
  const age = formData.get("age");
  const isAccepted = formData.get("isAccepted");
  const user = formData.get("user");
  const status = formData.get("status");
  const payment = formData.get("payment");

  try {
    //Buffer
    if (
      !year ||
      !name ||
      !phone ||
      !meliCode ||
      // degreeDoc.length == 0 ||
      age < 30 ||
      payment == 0
    ) {
      return Response.json({
        message: "لطفا اطلاعات بطور کامل بررسی و مجدد ارسال شود",
        status: 401,
      });
    }

    const lecturerFound = await lecturerModel.findOne({
      $and: [{ year }, { user }, { isRemoved: false }],
    });
    if (lecturerFound) {
      return Response.json({
        message: "شما قبلا یکبار ثبت نام نموده اید",
        status: 401,
      });
    }

    let degreeDocUrl = [];
    let certificateDocUrl = [];
    let introDocUrl = [];
    const lecturer = await lecturerModel.create({
      year,
      name,
      phone,
      prsCode,
      meliCode,
      occuptionState,
      organ,
      isAcademic,
      typeAcademic,
      govermental,
      province: JSON.parse(province),
      Region: JSON.parse(Region),
      degree: JSON.parse(degree),
      field: JSON.parse(field),
      introDoc: [],
      degreeDoc: [],
      certificateDoc: [],
      isCertificateBefore,
      age,
      isAccepted,
      user,
      status,
      payment,
      isRemove: false,
    });

    introDoc?.map(async (img, index) => {
      const buffer = Buffer.from(await img.arrayBuffer());
      const filename =
        Date.now() + "" + getRndInteger(10000, 100000) + img.name;
      const imgPath = path.join(
        process.cwd(),
        "upload/lecturer/intro/" + filename
      );
      await writeFile(imgPath, buffer);

      await lecturerModel.updateOne(
        { _id: lecturer._id },
        {
          $push: {
            // imageContractList: `${process.env.LOCAL_URL}/upload/contract/${filename}`,
            introDoc: `${filename}`,
          },
        }
      );
    });

    certificateDoc?.map(async (img, index) => {
      const buffer = Buffer.from(await img.arrayBuffer());
      const filename =
        Date.now() + "" + getRndInteger(10000, 100000) + img.name;
      const imgPath = path.join(
        process.cwd(),
        "upload/lecturer/certificate/" + filename
      );
      await writeFile(imgPath, buffer);

      await lecturerModel.updateOne(
        { _id: lecturer._id },
        {
          $push: {
            // imageContractList: `${process.env.LOCAL_URL}/upload/contract/${filename}`,
            certificateDoc: `${filename}`,
          },
        }
      );
    });

    degreeDoc?.map(async (img, index) => {
      const buffer = Buffer.from(await img.arrayBuffer());
      const filename =
        Date.now() + "" + getRndInteger(10000, 100000) + img.name;
      const imgPath = path.join(
        process.cwd(),
        "upload/lecturer/degree/" + filename
      );
      await writeFile(imgPath, buffer);

      await lecturerModel.updateOne(
        { _id: lecturer._id },
        {
          $push: {
            // imageContractList: `${process.env.LOCAL_URL}/upload/contract/${filename}`,
            degreeDoc: `${filename}`,
          },
        }
      );
    });

    if (lecturer) {
      return Response.json({
        message: " اطلاعات با موفقیت ثبت شد",
        status: 201,
      });
    }
  } catch (error) {
    console.log("error in api add lecturer>>", error);
    return Response.json({ message: "خطای ناشناخته", status: 501 });
  }

  return Response.json({ message: "خطا در ارسال اطلاعات", status: 401 });
}
