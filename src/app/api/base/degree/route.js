import DegreeModel from "@/models/base/Degree";
import { degree } from "@/utils/constants";
import connectToDB from "@/utils/db";

export async function GET(req, { params }) {
  try {
    const { isConnected, message } = await connectToDB();
    if (!isConnected) {
      console.log(message);
      return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
    }

    // await Promise.all(
    //   degree.map((item) => {
    //     const query = { code: item.code };
    //     const update = { $set: { name: item.name } };
    //     const options = { upsert: true };
    //     console.log("item-->", item);
    //     DegreeModel.findOneAndUpdate(query, update, options);
    //   })
    // );
    DegreeModel.bulkWrite(
        
        degree.map((item) => 
          ({
            updateOne: {
              filter:  { code: item.code },
              update: { $set: { name: item.name } },
              upsert: true
            }
          })
        )
      )

    return Response.json({
      message: "مدرک تحصیلی با موفقیت ثبت یا بروز شد",
      status: 200,
    });
  } catch (error) {
    console.log("Error ->", error);
    return Response.json({ message: "Unknown error !!!" });
  }
}
