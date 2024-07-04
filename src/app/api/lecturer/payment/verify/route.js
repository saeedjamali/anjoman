import { cookies } from 'next/headers';
import crypto from "crypto";
import { NextResponse } from 'next/server';
import { permanentRedirect, redirect } from 'next/navigation';

export async function POST(req, res) {
    try {

        const token = cookies().get('paymentData')?.value;
        // const token = req.token;

        if (!token) {
            return NextResponse.json({ error: 'No payment token found' }, { status: 400 });
        }

        const keyBuffer = Buffer.from("KTje3RNIhbijwGG2p69YQraFN5errUTV", "base64");
        const cipher = crypto.createCipheriv("des-ede3", keyBuffer, null);
        cipher.setAutoPadding(true);

        let encryptedSignData = cipher.update(token, "utf8", "base64");
        encryptedSignData += cipher.final("base64");

        const response = await fetch(
            "https://sadad.shaparak.ir/api/v0/Advice/Verify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, SignData: encryptedSignData }),
            }
        );

        const data = await response.json();
        return NextResponse.redirect(new URL(`https://peyvand.razaviedu.ir/api`, req.url));
        // const url = req.nextUrl.clone();

        // const request = req.url.origin;
        // console.log('data :>> ', data);
        // console.log('response :>> ', response);

        // console.log('req222 :>> ', res.searchParams);
        // console.log("Data NextURL-->", req.NextURL);

        // Serialize the data to use in the query parameters
        // const serializedData = encodeURIComponent(JSON.stringify(data));

        // Redirect with the data as a query parameter
        // const response2 = await fetch("/api/lecturer/payment/verify")
        // const data2= await response2.json
        //  return Response.json({data})
        // return NextResponse.redirect('/p-lecturer/verify', { status: 308 });
        // permanentRedirect(`https://peyvand.razaviedu.ir/p-lecturer`);
        // return new NextResponse(JSON.stringify({ success: true, message: "verify ok" }), {
        //     status: 401,
        //     headers: { "content-type": "application/json" },
        // });
        // return <div>test </div>

    } catch (error) {
        console.error(error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

// export async function GET() {
//     return new Response("Method Not Allowed", { status: 405 });
// }