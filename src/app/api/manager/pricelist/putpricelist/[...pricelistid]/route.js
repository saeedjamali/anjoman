
import connectToDB from "@/utils/db";
import priceListModel from "@/models/company/pricelist"
import { authAdmin, authManagerApi } from "@/utils/authenticateMe";

export async function PUT(req, { params }) {
    const priceListId = params.pricelistid[0];
    const currentYear = params.pricelistid[1];
    if (!(await authManagerApi())) {
        return Response.json({ message: "دسترسی غیر مجاز", status: 500 });

    }
    const body = await req.json();
    const { code,
        grade,
        gender,
        type,
        material,
        size,
        group,
        price,
        year } = body;

    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }

        const updatePriceList = await priceListModel.findOneAndUpdate(
            { $and: [{ _id: priceListId }, { year: currentYear }] }
            , {
                grade,
                gender,
                type,
                material,
                size,
                group,
                price,
                year

            });


        // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
        if (!updatePriceList) {
            return Response.json({ message: "برای این محصول اطلاعاتی در سال تحصیلی جاری یافت نشد", status: 401 });
        }

        return Response.json({ message: " اطلاعات محصول با موفقیت بروز شد", status: 201 });
    } catch (error) {
        console.log("Error ->", error)
        return Response.json({ message: "خطای ناشناخته !!!" });
    }
}


export async function DELETE(req, { params }) {
    const priceListId = params.pricelistid[0];
    const currentYear = params.pricelistid[1];

    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }

        //اطلاعات واحد سازمانی حذف نمی شود/ بلکه وضعیت به لغو تغییر میکند
        const deletedPriceItem = await priceListModel.findOneAndDelete({ $and: [{ _id: priceListId }, { year: currentYear }] });


        // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
        if (!deletedPriceItem) {
            return Response.json({ message: "خطا در حذف محصول", status: 401 });
        }

        return Response.json({ message: " محصول حذف گردید", status: 201 });
    } catch (error) {
        console.log("Error ->", error)
        return Response.json({ message: "خطای ناشناخته!!!" });
    }
}