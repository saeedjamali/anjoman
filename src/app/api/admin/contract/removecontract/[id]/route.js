import connectToDB from "@/utils/db";
import contractModel from "@/models/modiran/contract"
import { authAdminApi } from "@/utils/authenticateMe";

export async function DELETE(req, { params }) {
    if (!(await authAdminApi())) {
        return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
      }
    const contractId = params.id;
    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }


        const deletedContract = await contractModel.findOneAndDelete({ $and: [{ _id: contractId }, { isConfirm: 10 }] });


        // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
        if (!deletedContract) {
            return Response.json({ message: "صرفا درخواست با وضعیت فاقد قراراد امکان حذف دارند", status: 401 });
        }

        return Response.json({ message: " ردیف قراداد با وضعیت فاقد قرارداد حذف گردید", status: 201 });
    } catch (error) {
        console.log("Error ->", error)
        return Response.json({ message: "خطای ناشناخته!!!" });
    }
}