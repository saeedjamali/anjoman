
import connectToDB from "@/utils/db";
import contractModel from "@/models/modiran/contract"
import companyModel from "@/models/company/company";
import { authAdminApi } from "@/utils/authenticateMe";
export async function PUT(req) {
    if (!(await authAdminApi())) {
        return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
    }

    try {
        //? isconfirm : 
        //? 1-> تایید 
        //? 2-> لغو
        //? 3-> ابتدا تایید شده و اکنون لغو میشود
        //? 4-> قبلا تایید شده ولی توضیحات تغییر کرده
        //? 10-> مدارس فاقد قرارداد

        const { limited, description, isConfirm, code, unitcode, year, quantity, companycode } = await req.json();

        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }

        const upodateContract = await contractModel.findOneAndUpdate(
            { code }
            , {
                limited, description, isConfirm: isConfirm == 1 || isConfirm == 4 ? 1 : 2

            });


        //? بروزرسانی محدودیت دفعات و تعداد استفاده شده
        if (isConfirm == 1) {
            const foundCompany = await companyModel.findOneAndUpdate(
                {
                    code: companycode,
                },
                { $inc: { isUsed: quantity } }
            );
            const updateContract = await contractModel.updateMany({ $and: [{ 'Unit.schoolCode': unitcode }, { year }] }, { limited })
        }
        if (isConfirm == 3) {
            const foundCompany = await companyModel.findOneAndUpdate(
                {
                    code: companycode,
                },
                { $inc: { isUsed: -quantity } }
            );
        }
        if (isConfirm == 4) {

            const updateContract = await contractModel.updateMany({ $and: [{ 'Unit.schoolCode': unitcode }, { year }] }, { limited })
        }
        // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
        if (!upodateContract) {
            return Response.json({ message: "برای این قرارداد اطلاعاتی یافت نشد", status: 401 });
        }

        return Response.json({ message: " اطلاعات قرارداد با موفقیت بروز شد", status: 201 });
    } catch (error) {
        console.log("Error ->", error)
        return Response.json({ message: "خطای ناشناخته !!!" });
    }
}
