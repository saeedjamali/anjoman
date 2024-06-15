import contractModel from "@/models/modiran/contract";
import connectToDB from "@/utils/db";
import { image } from "@nextui-org/react";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
    const formData = await req.formData();
    const { isConnected, message } = await connectToDB();
    // const { year, Unit, modir } = body;
    const year = formData.get("year");
    const Unit = formData.get("Unit");
    const modir = formData.get("modir");

    try {

        if (!year || !Unit || !modir) {
            return Response.json(
                {
                    message: "لطفا اطلاعات بطور کامل بررسی و مجدد ارسال شود", status: 401
                }
            );
        }


        const contract = await contractModel.create({

            year,
            Unit: JSON.parse(Unit),
            modir: JSON.parse(modir),
            isConfirm: 10   //? مدارسی که قرارداد در سال تحصیلی ارسالی ندارند
        });

        if (contract) {
            return Response.json({
                message: " اطلاعات با موفقیت ثبت شد",
                status: 201,
            });
        }
    } catch (error) {
        console.log(error);
        return Response.json({ message: "خطای ناشناخته", status: 501 });
    }

    return Response.json({ message: "خطا در ارسال اطلاعات", status: 401 });
}
