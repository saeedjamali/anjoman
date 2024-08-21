import path from "path";
import fs from "fs";
import { authAdminApi, authenticateMe } from "@/utils/authenticateMe";

export async function GET(req, { params }) {
  const filename = params.filename[0];
  const code = params.filename[1];
  let filePath = "";
  if (!((await authenticateMe()) || (await authAdminApi()))) {
    return Response.json({ message: "دسترسی غیر مجاز", status: 500 });
  }

  //contract
  filePath = path.join(process.cwd(), `/upload/${code}/`, filename);

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
}
