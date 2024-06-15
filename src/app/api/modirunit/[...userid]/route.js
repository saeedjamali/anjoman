
import connectToDB from "@/utils/db";
import modirUnitModel from "@/models/modiran/modirUnit"
import mongoose from "mongoose";
import { authenticateMe } from "@/utils/authenticateMe";
// let ObjectId = require('mongoose').Types.ObjectId;
export async function GET(req, { params }) {
    if (!(await authenticateMe())) {
        return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
      }
    const userId = params.userid[0];
    // const year = params.userid[1];
    // console.log("year id ----->", year);

    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }

        // if (ObjectId.isValid(userId)) {
        //     return Response.json({ message: "شناسه کاربر نامعتبر می باشد", status: 401 });
        // }
        const foundedModirUnit = await modirUnitModel.find({
            $and: [
                { User: userId }
                // , { 'Unit.year': year }
            ]
            // ,
            // $or: [{ isActive: 0 }, { isActive: 1 }]
        }, "-__v ").populate([
            {
                path: 'Modir',
            }
        ]);

        // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
        if (!foundedModirUnit) {
            return Response.json({ message: "برای این مدیر هیچ واحد سازمانی پیش فرضی تعریف نشده است", status: 401 });
        }

        return Response.json({ message: "دریافت اطلاعات مدیر - واحد سازمانی با موفقیت انجام شد", status: 200, foundedModirUnit });
    } catch (error) {
        console.log("Error ->", error)
        return Response.json({ message: "Unknown error !!!" });
    }
}