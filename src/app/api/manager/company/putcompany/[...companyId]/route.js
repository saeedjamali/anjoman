
import connectToDB from "@/utils/db";
import companyModel from "@/models/company/company"
import { authAdmin, authManagerApi } from "@/utils/authenticateMe";

export async function PUT(req, { params }) {
    const companyId = params.companyId[0];
    const currentYear = params.companyId[1];
    if (!(await authManagerApi())) {
        return Response.json({ message: "دسترسی غیر مجاز", status: 500 });

    }
    const body = await req.json();
    const { owner,
        phone,
        ownerCode,
        name,
        address,
        lng,
        lat,
        isActive, year, capacity } = body;

    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }

        const updateCompany = await companyModel.findOneAndUpdate(
            { $and: [{ _id: companyId }, { year: currentYear }] }
            , {
                owner,
                phone,
                ownerCode,
                name,
                address,
                lng,
                lat,
                isActive,
                year,
                capacity

            });


        // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
        if (!updateCompany) {
            return Response.json({ message: "برای این شرکت اطلاعاتی در سال تحصیلی جاری یافت نشد", status: 401 });
        }

        return Response.json({ message: " اطلاعات شرکت با موفقیت بروز شد", status: 201 });
    } catch (error) {
        console.log("Error ->", error)
        return Response.json({ message: "خطای ناشناخته !!!" });
    }
}


export async function DELETE(req, { params }) {
    const companyId = params.companyId[0];
    const currentYear = params.companyId[1];

    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }

        //اطلاعات واحد سازمانی حذف نمی شود/ بلکه وضعیت به لغو تغییر میکند
        const deletedCompany = await companyModel.findOneAndUpdate({ $and: [{ _id: companyId }, { year: currentYear }] }, { isActive: 2 });


        // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
        if (!deletedCompany) {
            return Response.json({ message: "خطا در غیرفعالسازی شرکت", status: 401 });
        }

        return Response.json({ message: " وضعیت واحد سازمانی به لغو تغییرکرد", status: 201 });
    } catch (error) {
        console.log("Error ->", error)
        return Response.json({ message: "خطای ناشناخته!!!" });
    }
}