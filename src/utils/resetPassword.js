import userModel from "@/models/base/User";
import connectToDB from "./db";
import { hashPassword } from "./auth";

const ResetPassword = async (id, resetPass) => {
  try {
    const { isConnected } = await connectToDB();
    if (!isConnected) {
      return false;
    }

    const userFounded = await userModel.findOne({ _id: id });
    if (!userFounded) {
      return false;
    }

    const newHashPassword = await hashPassword(resetPass);
    const user = await userModel.findOneAndUpdate(
      { _id: id },
      { password: newHashPassword }
    );

    return user
  } catch (error) {
    return false
  }
};

export default ResetPassword;
