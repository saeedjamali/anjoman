import { permanentRedirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    const response = NextResponse.next();
    console.log("response--->", res)
    console.log("req--->", req)
    response.cookies.delete('paymentData')
    permanentRedirect(`https://peyvand.razaviedu.ir/p-lecturer`)
    // // return NextResponse.redirect(new URL(`http://localhost:3000`, req.url));

    // return Response.json({ message: "Hello" })

}