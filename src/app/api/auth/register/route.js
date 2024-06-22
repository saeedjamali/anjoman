import {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
} from "@/utils/auth";
import connectToDB from "@/utils/db";
import UserModel from "@/models/base/User";
import modirModel from "@/models/modiran/modir";
import modirUnitModel from "@/models/modiran/modirUnit";
import unitModel from "@/models/base/Unit";
import adminModel from "@/models/admin/adminRegion";
import regionModel from "@/models/base/Region";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { phone, role, identifier, year, password } = await req.json();

  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message }, { status: 500 });
    }

    const isUserExist = await UserModel.findOne({
      $and: [{ phone }, { role }],
    });

    if (isUserExist) {
      return NextResponse.json(
        {
          message: "کاربری با این شماره همراه/نقش قبلا ثبت نام نموده است",
          status: 422,
        },
        { status: 422 }
      );
    }
    const hashedPassword = await hashPassword(password);
    const accessToken = await generateAccessToken({ role, phone });

    if (role == "modir") {
      const isUnitExist = await unitModel.findOne({
        $and: [{ schoolCode: identifier }, { year }],
      });
      if (!isUnitExist) {
        return Response.json(
          { message: "کد با این مشخصات در سال تحصیلی جاری وجود ندارد" },
          { status: 422 }
        );
      }
      const isModirExist = await modirModel.findOne({ phone });
      if (isModirExist) {
        return Response.json(
          { message: "مدیر با این مشخصات وجود دارد" },
          { status: 422 }
        );
      }

      const isModirUnit = await modirUnitModel.findOne({
        $and: [
          { "Unit._id": isUnitExist._id },
          { "Unit.year": year },
          { isActive: 1 },
        ],
      });
      if (isModirUnit) {
        return Response.json(
          { message: "این واحد سازمانی در سال تحصیلی جاری مدیر فعال دارد" },
          { status: 422 }
        );
      }

      const user = await UserModel.create({
        phone,
        password: hashedPassword,
        role,
        identifier
      });

      const modir = await modirModel.create({
        user: user._id,
        phone,
      });

      // const unit = { ...isUnitExist, isActive: true };
      await modirUnitModel.create({
        Unit: isUnitExist,
        Modir: modir._id,
        User: user._id,
        defaultUnit: true,
      });
    }

    if (role == "admin") {
      const isRegionExist = await regionModel.findOne({
        regionCode: identifier,
      });

      if (!isRegionExist) {
        return Response.json(
          { message: "کد منطقه با این مشخصات در سال تحصیلی جاری وجود ندارد" },
          { status: 422 }
        );
      }
      const isAdminExist = await adminModel.findOne({ phone });
      if (isAdminExist) {
        return Response.json(
          { message: "کارشناس با این مشخصات وجود دارد" },
          { status: 422 }
        );
      }

      const user = await UserModel.create({
        phone,
        password: hashedPassword,
        role,
        identifier
      });

      const adminRegion = await adminModel.create({
        user: user._id,
        phone,
        Region: isRegionExist,
      });

      // const unit = { ...isUnitExist, isActive: true };

      if (!adminRegion) {
        return Response.json(
          { message: "خطا در تعریف کاربری جدید" },
          { status: 401 }
        );
      }
    }

    if (role == "lecturer") {

      const user = await UserModel.create({
        phone,
        password: hashedPassword,
        role,
        identifier
      });

      if (!user) {
        return Response.json(
          { message: "خطا در تعریف کاربری جدید" },
          { status: 401 }
        );
      }

      // const unit = { ...isUnitExist, isActive: true };


    }
    const refreshToken = await generateRefreshToken({ phone, role });

    await UserModel.findOneAndUpdate(
      { phone },
      {
        $set: {
          refreshToken,
        },
      }
    );

    const headers = new Headers();
    headers.append("Set-Cookie", `token=${accessToken};path=/;httpOnly=true;`);
    headers.append(
      "Set-Cookie",
      `refresh-token=${refreshToken};path=/;httpOnly=true;`
    );

    return Response.json(
      { message: "ثبت نام با موفقیت انجام شد", status: 201 },
      {
        status: 201,
        headers,

        // : { "Set-Cookie": `token=${accessToken};path=/;httpOnly=true` }
      }
    );
  } catch (error) {
    console.log("catch error -->", error);
    return Response.json({ message: "خطای ناشناخته" }, { status: 500 });
  }
}
