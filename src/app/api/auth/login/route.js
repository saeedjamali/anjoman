import {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  valiadtePassword,
  valiadtePhone,
  verifyAccessToken,
  verifyPassword,
  verifyRefreshToken,
} from "@/utils/auth";
import UserModel from "@/models/base/User";
import modirUnitModel from "@/models/modiran/modirUnit";
import connectToDB from "@/utils/db";

export async function POST(req) {
  try {
    const { isConnected } = await connectToDB();
    if (!isConnected) {
      return Response.json({ message: "خطا در ارتباط با پایگاه", status: 419 });
    }
    const body = await req.json();
    // console.log("body--->", body);
    const { phone, password, role } = body;

    // Validation
    const isValidPhone = valiadtePhone(phone);
    const isValidPassword = valiadtePassword(password);

    if (!isValidPhone || !isValidPassword) {
      return Response.json({
        message: "شماره موبایل یا رمز عبور نامعتبر می باشد",
        status: 419,
      });
    }

    const user = await UserModel.findOne({
      $and: [{ role }, { phone }],
    });
    // console.log("user--->", user);

    if (!user) {
      return Response.json({
        message: "کاربری با این مشخصات/نقش یافت نشد",
        status: 422,
      });
    }

    if (user.isBan) {
      return Response.json({
        message: "این کاربر/نقش مسدود شده است",
        status: 422,
      });
    }

    if (role == "modir") {
      const modirUnitExisted = await modirUnitModel.findOne({
        $and: [{ User: user._id }],
        $or: [{ isActive: 0 }, { isActive: 1 }],
      });
      if (!modirUnitExisted) {
        return Response.json({
          message: "برای این کاربر واحد سازمانی فعال وجود ندارد",
          status: 422,
        });
      }
    }

    const isCorrectPasswordWithHash = await verifyPassword(
      password,
      user.password
    );
    if (!isCorrectPasswordWithHash) {
      return Response.json({
        message: "شماره موبایل یا رمز عبور اشتباه است",
        status: 401,
      });
    }

    const accessToken = await generateAccessToken({ phone, role });

    const refreshToken = await generateRefreshToken({ phone, role });

    await UserModel.findOneAndUpdate(
      { $and: [{ phone }, { role }] },
      {
        $set: {
          refreshToken,
        },
      }
    );
    // console.log("u--->", u);
    const headers = new Headers();
    headers.append("Set-Cookie", `token=${accessToken};path=/;httpOnly=true;`);
    headers.append(
      "Set-Cookie",
      `refresh-token=${refreshToken};path=/;httpOnly=true;`
    );

    return Response.json(
      {
        message: "خوش آمدید",
        status: 200,
      },
      {
        headers,
      }
    );
  } catch (err) {
    console.log(err);
    return Response.json({
      message: err,
      status: 500,
    });
  }
}
