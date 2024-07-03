

import { NextResponse } from "next/server";
export async function GET(req) {
    // const body = await req.json();
    console.log("Subnmit--->", req)
    return NextResponse.redirect(new URL('/p-lecturer'), req.url);
    // return Response.json({ message: "welcome your submit" }, { status: 200 });
}

export const checkEnvironment = () => {
    let base_url =
        process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://peyvand.razaviedu.ir"; // https://v2ds.netlify.app

    return base_url;
};