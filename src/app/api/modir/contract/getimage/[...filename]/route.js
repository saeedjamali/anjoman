import path from "path";
import fs from "fs";

export async function GET(req, { params }) {
  const filename = params.filename[0];
  const code = params.filename[1];
  let filePath = "";

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
