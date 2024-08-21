import connectToDB from "@/utils/db";
import userModel from "@/models/base/User";
import modirUnitModel from "@/models/modiran/modirUnit";
import { authAdmin, authAdminApi } from "@/utils/authenticateMe";

export async function GET(req, { params }) {
  if (!(await authAdminApi())) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }

  const level = params.regionlevel[0];
  const regionCode = params.regionlevel[1];
  const provinceCode = params.regionlevel[2];
  let users = [];
  let usersInMuList = [];
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }
    if (level == 1) {
      //? access region
      // users = await modirUnitModel
      //   .find({ "Unit.regionCode": regionCode })
      //   .populate({
      //     path: "User",
      //   });
      usersInMuList = await modirUnitModel.aggregate([
        { $match: { "Unit.regionCode": regionCode } },
        {
          $group: {
            _id: "$User",
            count: { $sum: 1 }, // this means that the count will increment by 1
          },
        },
      ]);
      const userList = await Promise.all(
        await usersInMuList.map(async (user) => {
          const userFound = await userModel.findOne({
            $and: [{ _id: user._id }, { role: "modir" }],
          });
          if (userFound) {
            users.push({ ...userFound._doc, count: user.count });
          }
        })
      );
    }
    if (level == 2) {
      //? access province
      // users = await modirUnitModel
      //   .find({ "Unit.provinceCode": provinceCode })
      //   .populate({
      //     path: "User",
      //   });
      usersInMuList = await modirUnitModel.aggregate([
        { $match: { "Unit.provinceCode": provinceCode } },
        {
          $group: {
            _id: "$User",
            count: { $sum: 1 }, // this means that the count will increment by 1
          },
        },
      ]);

      const userList = await Promise.all(
        await usersInMuList.map(async (user) => {
          const userFound = await userModel.findOne({
            $and: [{ _id: user._id }, { role: "modir" }],
          });
          if (userFound) {
            users.push({ ...userFound._doc, count: user.count });
          }
        })
      );
    }
    if (level == 3 || level == 999) {
      //?global access

      usersInMuList = await modirUnitModel.aggregate([
        {
          $group: {
            _id: "$User",
            count: { $sum: 1 }, // this means that the count will increment by 1
          },
        },
      ]);
      const userList = await Promise.all(
        await usersInMuList.map(async (user) => {
          const userFound = await userModel.findOne({
            $and: [{ _id: user._id }, { role: "modir" }],
          });
          if (userFound) {
            users.push({ ...userFound._doc, count: user.count });
          }
        })
      );
    }

    // console.log("users------>", users);
    // await Promise.all(
    // usersInMuList.map(async (user) => {
    //   console.log("user--->", user);
    //   let filterUser = await userModel.findOne({
    //     $and: [{ _id: user._id }, { role: "modir" }],
    //   });
    //   // console.log("filterUser", filterUser._doc);
    //   users.push({ ...filterUser, count: user.count });
    //   // return { ...filterUser._doc, count: user.count };
    // });
    // // );
    // console.log("users------>", users);
    const len = users.length;
    if (users) {
      return Response.json({
        message: "با موفقیت دریافت شد",
        status: 201,
        users,
        len,
      });
    } else {
      return Response.json({
        message: "با موفقیت دریافت شد",
        status: 401,
        users,
        len,
      });
    }
  } catch (error) {
    console.log("Error--->", error);
    return Response.json({ message: "خطای ناشناخته", status: 500 });
  }
}
