import connectToDB from "@/utils/db";
import priceListModel from "@/models/company/pricelist"
import { authAdmin, authManagerApi } from "@/utils/authenticateMe";
export async function POST(req) {
    const priceList = await req.json();
    if (!(await authManagerApi())) {
        return Response.json({ message: "دسترسی غیر مجاز", status: 500 });

    }
    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }

        let updated = 0, added = 0;
        await Promise.all(await priceList.map(async (item) => {
            const {
                code,
                grade,
                gender,
                type,
                material,
                size,
                group,
                price,
                year } = item;
            const priceListUpdated = await priceListModel.findOneAndUpdate({ $and: [{ code }, { year }] }, {
                $set: {
                    grade,
                    gender,
                    type,
                    material,
                    size,
                    group,
                    price,
                    year
                }
            });
            if (priceListUpdated) {
                updated = updated + 1;
            } else {
                const priceListCreated = await priceListModel.create({
                    code,
                    grade,
                    gender,
                    type,
                    material,
                    size,
                    group,
                    price,
                    year
                },);
                added = added + 1;
            }

        }))

        return Response.json({ message: `${added} محصول اضافه و ${updated} بروز شد`, status: 201 });

    } catch (error) {
        console.log("Error ->", error)
        return Response.json({ message: "خطای ناشناخته !!!" });
    }


}