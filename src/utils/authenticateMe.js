import { cookies } from "next/headers";
import UserModel from "@/models/base/User";
import adminModel from "@/models/admin/adminRegion";
import connectToDB from "@/utils/db";
import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./auth";

const authenticateMe = async () => {
  await connectToDB();
  const accessToken = cookies().get("token")?.value;
  const refreshToken = cookies().get("refresh-token")?.value;

  //* Return Value this method
  //?        ===> 0 : access and refresh token is not verify and go to login
  //?         ===> 1 : access token is ok and not need check refresh and not regenerate access token
  //?         ===> 2 : access not validate but refresh is ok and need to regenrate access token
  let user = null;

  if (!accessToken) {
    return false;
  }

  const tokenPayload = await verifyAccessToken(accessToken);

  if (!tokenPayload) {
    if (!refreshToken) {
      return false;
    }

    const refreshTokenPayload = await verifyRefreshToken(refreshToken);
    if (!refreshTokenPayload) {
      return false;
    }
    if (refreshTokenPayload.role != "modir") {
      return false;
    }
    // refreshTokenPayload.role;
    const user = await UserModel.findOne(
      {
        $and: [
          { refreshToken },
          { role: refreshTokenPayload.role },
          { isBan: false },
        ],
      },
      "phone role _id"
    );
    if (!user) {
      return false;
    }

    // const newAccessToken = await generateAccessToken({ phone: user.phone, role: user.role });
    return user;
  }

  if (tokenPayload.role == "modir") {
    user = await UserModel.findOne(
      {
        $and: [
          { phone: tokenPayload.phone },
          { role: "modir" },
          { isBan: false },
        ],
      },
      "phone role isActive _id"
    );
  }

  if (!user) {
    return false;
  }

  return user;
};

//Authentication admin in level 1 -2 from front
const authAdmin = async () => {
  await connectToDB();
  const accessToken = cookies().get("token")?.value;
  const refreshToken = cookies().get("refresh-token")?.value;
  //* Return Value this method
  //?        ===> 0 : access and refresh token is not verify and go to login
  //?         ===> 1 : access token is ok and not need check refresh and not regenerate access token
  //?         ===> 2 : access not validate but refresh is ok and need to regenrate access token
  let user = null;

  if (!accessToken) {
    return false;
  }

  const tokenPayload = await verifyAccessToken(accessToken);
  if (!tokenPayload) {
    if (!refreshToken) {
      return false;
    }

    const refreshTokenPayload = await verifyRefreshToken(refreshToken);
    if (!refreshTokenPayload) {
      return false;
    }

    if (refreshTokenPayload.role != "admin") {
      return false;
    }
    user = await UserModel.findOne(
      {
        $and: [
          { refreshToken },
          { role: refreshTokenPayload.role },

          { isBan: false },
        ],
      },
      "phone role _id"
    );

    if (!user) {
      return false;
    }

    // const newAccessToken = await generateAccessToken({ phone: user.phone, role: user.role });
    return user;
  }

  if (tokenPayload.role == "admin") {
    user = await UserModel.findOne(
      {
        $and: [
          { phone: tokenPayload.phone },
          { role: "admin" },
          { isBan: false },
        ],
      },
      "phone role isActive level _id"
    );

    // console.log("admiiiiiiin", admin);
  }
  if (!user) {
    return false;
  }

  return user;
};

//Authentication manager in level 1 -2 from Back
const authManagerApi = async () => {
  await connectToDB();
  const accessToken = cookies().get("token")?.value;
  const refreshToken = cookies().get("refresh-token")?.value;
  //* Return Value this method
  //?        ===> 0 : access and refresh token is not verify and go to login
  //?         ===> 1 : access token is ok and not need check refresh and not regenerate access token
  //?         ===> 2 : access not validate but refresh is ok and need to regenrate access token
  let user = null;

  if (!accessToken) {
    return false;
  }

  const tokenPayload = await verifyAccessToken(accessToken);
  if (!tokenPayload) {
    if (!refreshToken) {
      return false;
    }

    const refreshTokenPayload = await verifyRefreshToken(refreshToken);
    if (!refreshTokenPayload) {
      return false;
    }

    if (refreshTokenPayload.role != "admin") {
      return false;
    }
    user = await UserModel.findOne(
      {
        $and: [
          { refreshToken },
          { role: refreshTokenPayload.role },

          { isBan: false },
        ],
      },
      "phone role _id"
    );

    if (!user) {
      return false;
    }
    const admin = await adminModel.findOne({
      $and: [{ user: user._id }, { isActive: 1 }, { level: 999 }],
    });
    if (!admin) {
      return false;
    }
    // const newAccessToken = await generateAccessToken({ phone: user.phone, role: user.role });
    return user;
  }

  if (tokenPayload.role == "admin") {
    user = await UserModel.findOne(
      {
        $and: [
          { phone: tokenPayload.phone },
          { role: "admin" },
          { isBan: false },
        ],
      },
      "phone role isActive level _id"
    );
    const admin = await adminModel.findOne({
      $and: [{ user: user._id }, { isActive: 1 }, { level: 999 }],
    });
    if (!admin) {
      return false;
    }
    // console.log("admiiiiiiin", admin);
  }
  if (!user) {
    return false;
  }

  return user;
};

//Authentication admin in level 1 -2 from Back
const authAdminApi = async () => {
  await connectToDB();
  const accessToken = cookies().get("token")?.value;
  const refreshToken = cookies().get("refresh-token")?.value;
  //* Return Value this method
  //?        ===> 0 : access and refresh token is not verify and go to login
  //?         ===> 1 : access token is ok and not need check refresh and not regenerate access token
  //?         ===> 2 : access not validate but refresh is ok and need to regenrate access token
  let user = null;

  if (!accessToken) {
    return false;
  }

  const tokenPayload = await verifyAccessToken(accessToken);
  if (!tokenPayload) {
    if (!refreshToken) {
      return false;
    }

    const refreshTokenPayload = await verifyRefreshToken(refreshToken);
    if (!refreshTokenPayload) {
      return false;
    }

    if (refreshTokenPayload.role != "admin") {
      return false;
    }
    user = await UserModel.findOne(
      {
        $and: [
          { refreshToken },
          { role: refreshTokenPayload.role },

          { isBan: false },
        ],
      },
      "phone role _id"
    );

    if (!user) {
      return false;
    }

    const admin = await adminModel.findOne({
      $and: [{ user: user._id }, { isActive: 1 }]
      
    });
    if (!admin) {
      return false;
    }
    // const newAccessToken = await generateAccessToken({ phone: user.phone, role: user.role });
    return user;
  }

  if (tokenPayload.role == "admin") {
    user = await UserModel.findOne(
      {
        $and: [
          { phone: tokenPayload.phone },
          { role: "admin" },
          { isBan: false },
        ],
      },
      "phone role isActive level _id"
    );
    const admin = await adminModel.findOne({
      $and: [{ user: user._id }, { isActive: 1 }]
      // $or: [{ level: 1 }, { level: 2 }],
    });
    if (!admin) {
      return false;
    }
    // console.log("admiiiiiiin", admin);
  }
  if (!user) {
    return false;
  }

  return user;
};



const authenticateLecturer = async () => {
  await connectToDB();
  const accessToken = cookies().get("token")?.value;
  const refreshToken = cookies().get("refresh-token")?.value;

  //* Return Value this method
  //?        ===> 0 : access and refresh token is not verify and go to login
  //?         ===> 1 : access token is ok and not need check refresh and not regenerate access token
  //?         ===> 2 : access not validate but refresh is ok and need to regenrate access token
  let user = null;

  if (!accessToken) {
    return false;
  }

  const tokenPayload = await verifyAccessToken(accessToken);

  if (!tokenPayload) {
    if (!refreshToken) {
      return false;
    }

    const refreshTokenPayload = await verifyRefreshToken(refreshToken);
    if (!refreshTokenPayload) {
      return false;
    }
    if (refreshTokenPayload.role != "lecturer") {
      return false;
    }
    // refreshTokenPayload.role;
    const user = await UserModel.findOne(
      {
        $and: [
          { refreshToken },
          { role: refreshTokenPayload.role },
          { isBan: false },
        ],
      },
      "phone identifier role isActive isBan _id"
    );
    if (!user) {
      return false;
    }

    // const newAccessToken = await generateAccessToken({ phone: user.phone, role: user.role });
    return user;
  }

  if (tokenPayload.role == "lecturer") {
    user = await UserModel.findOne(
      {
        $and: [
          { phone: tokenPayload.phone },
          { role: "lecturer" },
          { isBan: false },
        ],
      },
      "phone identifier role isActive isBan _id"
    );
  }

  if (!user) {
    return false;
  }

  return user;
};
export { authenticateMe, authAdmin, authAdminApi, authManagerApi,authenticateLecturer };
