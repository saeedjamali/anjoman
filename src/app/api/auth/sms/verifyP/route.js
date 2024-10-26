import connectToDB from "@/configs/db";
import OtpModel from "@/models/Otp";
export async function POST(req) {
  try {
  connectToDB();
  if (req.method !== "POST") {
    return false;
  }
  const body = await req.json();
  const { phone, code } = body;
  
  // Validation (You) ✅
  if (!phone || !code) {
    throw new Error("This api protected and you can't access it !!");
  }
  const otp = await OtpModel.findOne({ phone, code });

  if (otp) {
    const date = new Date();
    const now = date.getTime();

    if (otp.expTime > now) {
      return Response.json({ message: "Code is correct :))" }, { status: 200 });
    } else {
      return Response.json({ message: "Code is expired :))" }, { status: 410 });
    }
  } else {
    return Response.json(
      { message: "Code is not correct !!" },
      { status: 409 }
    );
  }
} catch (err) {

  console.log(err)
  return Response.json({ message: err.message }, { status: 500 });
}
}

