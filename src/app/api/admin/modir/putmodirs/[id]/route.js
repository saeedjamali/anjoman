import connectToDB from "@/utils/db";
import modirModel from "@/models/modiran/modir";
import modirUnitModel from "@/models/modiran/modirUnit";
import { authAdminApi } from "@/utils/authenticateMe";

export async function PUT(req, { params }) {
  if (!(await authAdminApi())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }
  const modirid = params.id;

  try {
    const body = await req.json();
    const { name, prsCode, meliCode, isActiveM, comment, muId } = body;
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    const updateModir = await modirModel.findOneAndUpdate(
      { _id: modirid },
      {
        name,
        prsCode,
        meliCode,
        isActive: isActiveM,
        comment,
      }
    );

    // console.log("osConfirm--->", isActiveM);
    if (isActiveM == 0 || isActiveM == 2) {
      const updateModirUnitIsActive = await modirUnitModel.findOneAndUpdate(
        { _id: muId },
        { isActive: isActiveM }
      );
    }

    // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
    if (!updateModir) {
      return Response.json({
        message: "برای این مدیر اطلاعاتی یافت نشد",
        status: 401,
      });
    }

    return Response.json({
      message: " اطلاعات مدیر با موفقیت بروز شد",
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
