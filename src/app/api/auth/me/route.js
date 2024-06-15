import connectToDB from "@/utils/db";
import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from "@/utils/auth";
import { cookies } from "next/headers";
import UserModel from "@/models/base/User";

export async function GET(req) {
  
  try {
    await connectToDB();
    const accessToken = cookies().get("token")?.value;
    const refreshToken = cookies().get("refresh-token")?.value;
    
    let user = null;
    if (!accessToken) {

      return Response.json({ message: "AccessToken not exist !!", status: 401 })
    }
    
    const tokenPayload = await verifyAccessToken(accessToken);
    
    if (!tokenPayload) {
    
      if (!refreshToken) {
        return Response.json({ message: "RefreshToken not exist !!", status: 401 })
      }
     
      const refreshTokenPayload = await verifyRefreshToken(refreshToken);
      
      if (!refreshTokenPayload) {
        

        return Response.json({ message: "RefreshToken not verify !!",status:401 })
      }
      
      const user = await UserModel.findOne({
        $and: [
          { refreshToken }, { isBan: false }
        ]
      }, "phone role isActive _id ");
      if (!user) {
        return Response.json({ message: "user not exist with refreshToken!!", status: 401 })
      }

      const newAccessToken = await generateAccessToken({ phone: user.phone, role: user.role });
      return Response.json(
        { message: "generate new access token", status: 201,user },
        {
          status: 201,
          headers: { "Set-Cookie": `token=${newAccessToken};path=/;httpOnly=true` },
        }
      );

    }

    user = await UserModel.findOne({
      $and: [
        { phone: tokenPayload.phone }, { role: tokenPayload.role }, { isBan: false }
      ]
    }, "phone role isActive _id");
    if (!user) {
      return Response.json({ message: "User not exist with AccessToken!!", status: 401 })
    }
    
    return Response.json({ message: "AccessToken verify :)", status: 201,user })
  } catch (error) {
    console.log("Catch Error : ", error);
    return Response.json({ message: "AccessToken not exist !!", status: 401 })

  }
}
