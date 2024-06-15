import connectToDB from "@/utils/db";
import companyModel from "@/models/company/company"
import regCompanyModel from "@/models/company/regcompany"
import regionModel from "@/models/base/Region"
import { authAdmin, authManagerApi } from "@/utils/authenticateMe";
export async function POST(req) {
    if (!(await authManagerApi())) {
        return Response.json({ message: "دسترسی غیر مجاز", status: 500 });

    }
    let { companies, region, year } = await req.json();
    let allRegion = region[0] == 'a' ? true : false;
    let allCompany = companies[0] == 'a' ? true : false;
    try {
        const { isConnected, message } = await connectToDB();
        if (!isConnected) {
            return Response.json({ message: "خطا در اتصال به پایگاه", status: 500 });
        }

        if (allCompany) {
            companies = [];
            const companyExist = await companyModel.find({ $or: [{ isActive: 0 }, { isActive: 1 }], $and: [{ year }] });
            companyExist.map(company => companies.push(company._id))
        }
        if (allRegion) {
            region = [];
            const regionExist = await regionModel.find();
            regionExist.map(reg => region.push(reg._id))
        }

        let updated = 0, added = 0;
        await Promise.all(await region.map(async (rg) => {

            const regCompanyUpdated = await regCompanyModel.findOneAndUpdate({ $and: [{ Region: rg }, { year }] }, {
                $set: {
                    companies
                }
            });
            if (regCompanyUpdated) {
                updated = updated + 1;
            } else {
                const regCompanyCreated = await regCompanyModel.create({
                    Region: rg, companies, year
                });
                added = added + 1;
            }

        }))


        return Response.json({ message: `اطلاعات شرکت های ${updated} منطقه بروز و اطلاعات شرکت ها به ${added} منطقه افزوده شد`, status: 201 });
    } catch (error) {

        return Response.json({ message: "خطای ناشناخته", status: 500 })
    }
}