import connectToDB from "@/utils/db";
import modriUnitModel from "@/models/modiran/modirUnit";
import UnitModel from "@/models/base/Unit";
import modirUnitModel from "@/models/modiran/modirUnit";
import { authAdminApi } from "@/utils/authenticateMe";

export async function PUT(req, { params }) {
  const muId = params.id;
  const body = await req.json();
  const { female, male, isConfirm, lng, lat, address } = body;
  if (!(await authAdminApi())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    const updateUnit = await modriUnitModel.findOneAndUpdate(
      { _id: muId },
      {
        "Unit.female": female,
        "Unit.male": male,
        "Unit.isConfirm": isConfirm,
        "Unit.lng": lng,
        "Unit.lat": lat,
        "Unit.schoolAddress": address,
      }
    );
    const unit = await UnitModel.updateMany(
      {
        schoolCode: updateUnit.Unit.schoolCode,
      },
      { schoolAddress: address }
    );

    // console.log("osConfirm--->", isActiveM);
    if (isConfirm == 0 || isConfirm == 2) {
      const updateModirUnitIsActive = await modirUnitModel.findOneAndUpdate(
        { _id: muId },
        { isActive: isConfirm }
      );
    }
    // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
    if (!updateUnit) {
      return Response.json({
        message: "برای این واحد سازمانی اطلاعاتی یافت نشد",
        status: 401,
      });
    }

    return Response.json({
      message: " اطلاعات واحد سازمانی با موفقیت بروز شد",
      status: 201,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "خطای ناشناخته !!!" });
  }
}

// export async function DELETE(req, { params }) {
//   const unitId = params.id;

//   try {
//     const { isConnected, message } = await connectToDB();
//     if (!isConnected) {
//       return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
//     }

//     //اطلاعات واحد سازمانی حذف نمی شود/ بلکه وضعیت به لغو تغییر میکند
//     const deletedUnit = await unitModel.findOneAndDelete({ _id: unitId });

//     // return Response.json({ message: "کاربری با این شماره قبلا ثبت نام نموده است", status: 401, foundedUser });
//     if (!deletedUnit) {
//       return Response.json({ message: "خطا در حذف واحد سازمانی", status: 401 });
//     }

//     return Response.json({
//       message: "واحد سازمانی با موفقیت حذف شد",
//       status: 201,
//     });
//   } catch (error) {
//     console.log("Error ->", error);
//     return Response.json({ message: "خطای ناشناخته!!!" });
//   }
// }
