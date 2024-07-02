import { cookies } from 'next/headers';
import crypto from "crypto";

export async function POST(req) {
    try {
        const token = cookies().get('paymentData')?.value;

        const keyBuffer = Buffer.from("KTje3RNIhbijwGG2p69YQraFN5errUTV", "base64");
        const cipher = crypto.createCipheriv("des-ede3", keyBuffer, null);
        cipher.setAutoPadding(true);

        let encryptedSignData = cipher.update(token, "utf8", "base64");
        encryptedSignData += cipher.final("base64");

        if (!token) {
            return Response.json({ error: 'No payment token found' }, { status: 400 });
        }

        const response = await fetch(
            "https://sadad.shaparak.ir/api/v0/Advice/Verify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, SignData:encryptedSignData }),
            }
        );

        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        console.error(error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    return new Response("Method Not Allowed", { status: 405 });
}