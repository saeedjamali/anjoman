
import connectToDB from "@/utils/db";
import unitModel from "@/models/base/Unit"
import { authAdmin } from "@/utils/authenticateMe";

export async function PUT(req, { params }) {
    if (!(await authAdmin())) {
        return Response.json({ message: "دسترسی غیر مجاز", status: 500 });

    }
    const unitId = params.unitId;

    const body = await req.json();
    const { provinceName,
        provinceCode,
        regionCode,
        regionName,
        schoolCode,
        schoolName,
        female,
        male,
        lng,
        lat,
        year } = body;

    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }

        const updateUnit = await unitModel.findOneAndUpdate(
            { _id: unitId }
            , {
                provinceName,
                provinceCode,
                regionCode,
                regionName,
                schoolCode,
                schoolName,
                female,
                male,
                lng,
                lat,
                year
            });


        // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
        if (!updateUnit) {
            return Response.json({ message: "برای این واحد سازمانی اطلاعاتی یافت نشد", status: 401 });
        }

        return Response.json({ message: " اطلاعات واحد سازمانی با موفقیت بروز شد", status: 201 });
    } catch (error) {
        console.log("Error ->", error)
        return Response.json({ message: "Unknown error !!!" });
    }
}


export async function DELETE(req, { params }) {
    const unitId = params.unitId;

    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }

        const deleteUnit = await unitModel.findOneAndDelete({ _id: unitId });


        // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
        if (!deleteUnit) {
            return Response.json({ message: "خطا در حذف واحد سازمانی", status: 401 });
        }

        return Response.json({ message: " واحد سازمانی حذف شد", status: 201 });
    } catch (error) {
        console.log("Error ->", error)
        return Response.json({ message: "Unknown error !!!" });
    }
}