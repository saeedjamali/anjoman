import connectToDB from "@/utils/db";
import companyModel from "@/models/company/company"
import { authAdmin, authAdminApi, authManagerApi } from "@/utils/authenticateMe";
export async function POST(req) {
    const companies = await req.json();
    if (!(await authManagerApi())) {
        return Response.json({ message: "دسترسی غیر مجاز", status: 500 });

    }
    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }

        let updated = 0, added = 0;
        await Promise.all(await companies.map(async (company) => {
            const {

                code,
                owner,
                phone,
                ownerCode,
                name,
                address,
                lng,
                lat,
                isActive, year, capacity } = company;
            const companyUpdated = await companyModel.findOneAndUpdate({ $and: [{ code }, { year }] }, {
                $set: {
                    owner,
                    phone,
                    ownerCode,
                    name,
                    address,
                    lng,
                    lat,
                    isActive, year, capacity
                }
            });
            if (companyUpdated) {
                updated = updated + 1;
            } else {
                const companyCreated = await companyModel.create({
                    code,
                    owner,
                    phone,
                    ownerCode,
                    name,
                    address,
                    lng,
                    lat,
                    isActive,
                    year, capacity
                },);
                added = added + 1;
            }

        }))

        return Response.json({ message: `${added} شرکت اضافه و ${updated} بروز شد`, status: 201 });

    } catch (error) {
        console.log("Error ->", error)
        return Response.json({ message: "خطای ناشناخته !!!" });
    }


}