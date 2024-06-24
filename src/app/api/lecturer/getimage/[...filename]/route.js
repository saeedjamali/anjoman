import path from "path";
import fs from "fs";
import { authManagerApi, authenticateLecturer } from "@/utils/authenticateMe";

export async function GET(req, { params }) {
    if (await authenticateLecturer() || await authManagerApi() || await authProvinceAdminApi()) {
        const filename = params.filename[0];
        const code = params.filename[1];
        let filePath = "";

        //contract
        filePath = path.join(process.cwd(), `/upload/lecturer/${code}/`, filename);

        //formdress
        // filePath = path.join(process.cwd(), "/upload/formdress/", filename);

        try {
            const file = fs.readFileSync(filePath);
            // console.log("file -->", file);

            return new Response(file, {
                headers: {
                    "Content-Type": "image/jpeg",
                },
            });
        } catch (err) {
            return new Response("File not found", { status: 404 });
        }
    } else {
        return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
    }


}
