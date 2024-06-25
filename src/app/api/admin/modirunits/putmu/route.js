import connectToDB from "@/utils/db";
import modriUnitModel from "@/models/modiran/modirUnit";
import modirModel from "@/models/modiran/modir";
import { authAdminApi } from "@/utils/authenticateMe";
let ObjectId = require("mongoose").Types.ObjectId;
export async function POST(req) {
  const formData = await req.formData();
  const selectedKeys = formData.getAll("selectedKeys");
  const action = selectedKeys.pop();

  if (!(await authAdminApi())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    if (selectedKeys.join("") == "all") {
      if (action == 1) {
        const updateMu = await modriUnitModel.updateMany(
          {},
          {
            isActive: action,
            "Unit.isConfirm": action,
          }
        );
        const allMus = await modriUnitModel.find();
        allMus.map(async (item) => {
          await modirModel.findOneAndUpdate(
            { _id: item.Modir },
            { isActive: action }
          );
        });
      } else if (action == 2) {
        const updateMu = await modriUnitModel.updateMany(
          {},
          {
            isActive: action,
            "Unit.isConfirm": action,
          }
        );
      }
      return Response.json({
        message: "اطلاعات کلیه  مدیران-واحد سازمانی تایید شد",
        status: 201,
      });
    }

    if (action == 1) {
      selectedKeys.map(async (item) => {
        const updateUnit = await modriUnitModel.findOneAndUpdate(
          { _id: item },
          { isActive: action, "Unit.isConfirm": action }
        );
        await modirModel.findOneAndUpdate(
          { _id: updateUnit.Modir },
          { isActive: action }
        );
      });
    } else if (action == 2) {
      selectedKeys.map(async (item) => {
        const updateUnit = await modriUnitModel.findOneAndUpdate(
          { _id: item },
          { isActive: action }
        );
      });
    }

    return Response.json({
      message: " اطلاعات مدیر - واحد سازمانی با موفقیت بروز شد",
      status: 201,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "خطای ناشناخته !!!" });
  }
}
