import connectToDB from "@/utils/db";
import { authAdminApi } from "@/utils/authenticateMe";
import lecturerModel from "@/models/lecturer/lecturer"

export async function PUT(req, { params }) {
    if (!(await authAdminApi())) {
        return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
    }

    try {
        const formData = await req.formData();
        const year = formData.get("year");
        const user = formData.get("user");
        const name = formData.get("name");
        const phone = formData.get("phone");
        const prsCode = formData.get("prsCode");
        const meliCode = formData.get("meliCode");
        const occuptionState = formData.get("occuptionState");
        const organ = formData.get("organ");
        const isAcademic = formData.get("isAcademic");
        const typeAcademic = formData.get("typeAcademic");
        const province = formData.get("province");
        const Region = formData.get("region");
        const degree = formData.get("degree");
        const field = formData.get("field");
        const isCertificateBefore = formData.get("isCertificateBefore");
        const age = formData.get("age");
        const isAccepted = formData.get("isAccepted");
        const status = formData.get("status");
        const payment = formData.get("payment");


        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }

        const updateLecturer = await lecturerModel.findOneAndUpdate(
            { $and: [{ _id: user }, { phone }, { year }] },
            {
                name,
                phone,
                prsCode,
                meliCode,
                occuptionState,
                organ,
                isAcademic,
                typeAcademic,
                province,
                Region,
                degree,
                field,
                isCertificateBefore,
                age,
                isAccepted,
                status,
                payment
            }
        );



        // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
        if (!updateLecturer) {
            return Response.json({
                message: "برای این مدرس اطلاعاتی یافت نشد",
                status: 401,
            });
        }

        return Response.json({
            message: " اطلاعات مدرس با موفقیت بروز شد",
            status: 201,
        });
    } catch (error) {
        console.log("Error ->", error);
        return Response.json({ message: "خطای ناشناخته !!!" });
    }
}

export async function DELETE(req, { params }) {
    const modirid = params.id;
    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }

        //اطلاعات واحد سازمانی حذف نمی شود/ بلکه وضعیت به لغو تغییر میکند
        const deletedModir = await modirModel.findOneAndUpdate(
            { _id: modirid },
            { isActive: 2 }
        );

        // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
        if (!deletedModir) {
            return Response.json({ message: "خطا در غیرفعالسازی مدیر", status: 401 });
        }

        return Response.json({
            message: " وضعیت مدیر به لغو تغییرکرد",
            status: 201,
        });
    } catch (error) {
        console.log("Error ->", error);
        return Response.json({ message: "خطای ناشناخته!!!" });
    }
}
