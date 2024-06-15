import contractModel from "@/models/modiran/contract";
import { authenticateMe } from "@/utils/authenticateMe";
import connectToDB from "@/utils/db";
import { getRndInteger } from "@/utils/random";
import { image } from "@nextui-org/react";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  const { isConnected, message } = await connectToDB();
  const formData = await req.formData();
  const imageFormDressList = formData.getAll("imageFormDressList");
  const imageFormDressUrls = formData.getAll("imageFormDressUrls");
  const imageContractList = formData.getAll("imageContractList");
  const imageContractUrls = formData.getAll("imageContractUrls");
  const address = formData.get("address");
  const lat = formData.get("lat");
  const lng = formData.get("lng");
  const year = formData.get("year");
  const Unit = formData.get("Unit");
  const modir = formData.get("modir");
  const company = formData.get("company");
  const pricelist = formData.getAll("pricelist");
  let limited = 1;
  let quantity = 0;
  if (!(await authenticateMe())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }
  try {
    //Buffer
    if (!year || !lat || !lng || !Unit || !company || pricelist.length == 0) {
      return Response.json(
        {
          message: "لطفا اطلاعات بطور کامل بررسی و مجدد ارسال شود",
          year,
          lat,
          lng,
          Unit,
          company,
          pricelist,
        },
        { status: 401 }
      );
    }

    const foundContract = await contractModel.findOne({
      $and: [{ year }, { "Unit.schoolCode": Unit.schoolCode }],
    });
    if (foundContract) {
      limited = foundContract.limited;
    }

    let imageContractListUrl = [];
    let imageFormDressListUrl = [];
    const contract = await contractModel.create({
      imageContractList: imageContractListUrl,
      imageFormDressList: imageFormDressListUrl,
      address,
      lat,
      lng,
      year,
      Unit: JSON.parse(Unit),
      modir: JSON.parse(modir),
      company: JSON.parse(company),
      limited,
    });

    await Promise.all(
      pricelist?.map(async (item) => {
        // let q = parseInt(JSON.parse(item).quantity);

        await contractModel.updateOne(
          { _id: contract._id },
          { $push: { Pricelists: JSON.parse(item) } }
        );
        // quantity += q;
      })
    );

    // imageContractUrls?.map(async (url, index) => {
    //   imageContractListUrl.push(url);
    //   await contractModel.updateOne(
    //     { _id: contract._id },
    //     {
    //       $push: {
    //         imageContractList: url,
    //       },
    //     }
    //   );
    // });

    imageContractList?.map(async (img, index) => {
      const buffer = Buffer.from(await img.arrayBuffer());
      const filename = Date.now()+"" + getRndInteger(10000, 100000) + img.name;
      const imgPath = path.join(process.cwd(), "upload/contract/" + filename);
      await writeFile(imgPath, buffer);

      //?liara
      // imageContractListUrl.push(
      //   `${process.env.LOCAL_URL}/upload/contract/${filename}`
      // );
      await contractModel.updateOne(
        { _id: contract._id },
        {
          $push: {
            // imageContractList: `${process.env.LOCAL_URL}/upload/contract/${filename}`,
            imageContractList: `${filename}`,
          },
        }
      );
    });

    // imageFormDressUrls?.map(async (url, index) => {

    //   imageContractListUrl.push(url);
    //   await contractModel.updateOne(
    //     { _id: contract._id },
    //     {
    //       $push: {
    //         imageFormDressList: url,
    //       },
    //     }
    //   );
    // });

    imageFormDressList?.map(async (img, index) => {
      const buffer = Buffer.from(await img.arrayBuffer());
      const filename =
        Date.now() + "" + getRndInteger(10000, 100000) + img.name;
      const imgPath = path.join(process.cwd(), "upload/formdress/" + filename);
      await writeFile(imgPath, buffer);
      // imageContractListUrl.push(
      //   `${process.env.LOCAL_URL}/upload/formdress/${filename}`
      // );
      await contractModel.updateOne(
        { _id: contract._id },
        {
          $push: {
            // imageFormDressList: `${process.env.LOCAL_URL}/upload/formdress/${filename}`,
            imageFormDressList: `${filename}`,
          },
        }
      );
    });
    // const foundCompany = await companyModel.findOneAndUpdate(
    //   {
    //     _id: JSON.parse(company),
    //   },
    //   { $inc: { isUsed: quantity } }
    // );

    if (contract) {
      return Response.json({
        message: " اطلاعات با موفقیت ثبت شد",
        status: 201,
      });
    }
  } catch (error) {
    console.log("error in api add image>>", error);
    return Response.json({ message: "خطای ناشناخته", status: 501 });
  }

  return Response.json({ message: "خطا در ارسال اطلاعات", status: 401 });
}
