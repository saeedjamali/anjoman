import connectToDB from "@/utils/db";
import modirUnitModel from "@/models/modiran/modirUnit";
import mongoose from "mongoose";
import UnitModel from "@/models/base/Unit";
import { authenticateMe } from "@/utils/authenticateMe";
// let ObjectId = require('mongoose').Types.ObjectId;
export async function PUT(req, { params }) {
  if (!(await authenticateMe())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }
  const userId = params.userid[0];
  const unitId = params.userid[1];
  const body = await req.json();
  const { male, female, lat, lng, address, schoolCode } = body;

  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    // if (ObjectId.isValid(userId)) {
    //     return Response.json({ message: "شناسه کاربر نامعتبر می باشد", status: 401 });
    // }

    const updateUnit = await modirUnitModel.findOneAndUpdate(
      {
        $and: [{ User: userId }, { "Unit._id": unitId }],
      },
      {
        "Unit.male": male,
        "Unit.female": female,
        "Unit.lat": lat,
        "Unit.lng": lng,
        "Unit.schoolAddress": address,
        "Unit.isConfirm": 0,
      }
    );

    const unit = await UnitModel.updateMany(
      {
        schoolCode,
      },
      { schoolAddress: address }
    );
    // const foundedModirUnit = await modirUnitModel.find({
    //     $and: [
    //         { User: userId }
    //         , { 'Unit._id': unitId }
    //     ]
    //     // ,
    //     // $or: [{ isActive: 0 }, { isActive: 1 }]
    // });

    // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
    if (!updateUnit) {
      return Response.json({
        message: "برای این واحد سازمانی اطلاعاتی یافت نشد",
        status: 401,
      });
    }

    return Response.json({
      message: " اطلاعات واحد سازمانی با موفقیت بروز شد",
      status: 200,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "Unknown error !!!" });
  }
}
